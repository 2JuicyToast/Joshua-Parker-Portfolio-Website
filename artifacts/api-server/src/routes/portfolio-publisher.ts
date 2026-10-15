import { randomBytes } from "node:crypto";
import { Router, type Request, type Response } from "express";

declare module "express-session" {
  interface SessionData {
    githubAccessToken?: string;
    githubLogin?: string;
    portfolioOAuthState?: string;
  }
}

const router = Router();
const repositoryOwner = "2JuicyToast";
const repositoryName = "Joshua-Parker-Portfolio-Website";
const allowedPublisher = "2JuicyToast";
const contentPath =
  "artifacts/joshua-parker-portfolio/public/portfolio-content.json";
const githubApiBase = "https://api.github.com";
const githubApiVersion = "2022-11-28";

type OAuthTokenResponse = {
  access_token?: string;
  error?: string;
};

type GitHubUser = {
  login?: string;
};

type GitHubFile = {
  sha?: string;
  content?: string;
  encoding?: string;
};

function isPublisherEnabled() {
  return process.env.NODE_ENV !== "production";
}

function hasOAuthConfiguration() {
  return Boolean(
    process.env.GITHUB_OAUTH_CLIENT_ID &&
      process.env.GITHUB_OAUTH_CLIENT_SECRET,
  );
}

function getCallbackUrl() {
  const configuredUrl = process.env.GITHUB_OAUTH_CALLBACK_URL?.trim();
  if (configuredUrl) return configuredUrl;

  const devDomain = process.env.REPLIT_DEV_DOMAIN?.trim();
  if (!devDomain) {
    throw new Error(
      "Set GITHUB_OAUTH_CALLBACK_URL or run the portfolio in its Replit development preview.",
    );
  }
  return `https://${devDomain}/api/portfolio/publisher/callback`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEditableContent(value: unknown) {
  if (!isRecord(value) || !Array.isArray(value.writingSections)) return false;
  const portfolio = value.portfolio;
  if (!isRecord(portfolio)) return false;
  return isRecord(portfolio.identity) && isRecord(portfolio.pages);
}

function isSameOriginRequest(req: Request) {
  const origin = req.get("origin");
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0].trim();
  const requestHost = forwardedHost || req.get("host");
  if (!origin || !requestHost) return false;

  try {
    return new URL(origin).host.toLowerCase() === requestHost.toLowerCase();
  } catch {
    return false;
  }
}

function rejectCrossOriginRequest(req: Request, res: Response) {
  if (isSameOriginRequest(req)) return false;
  res.status(403).json({ error: "This publishing request must come from this site." });
  return true;
}

function githubHeaders(accessToken: string) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${accessToken}`,
    "X-GitHub-Api-Version": githubApiVersion,
    "User-Agent": "Joshua-D-Parker-Portfolio",
  };
}

async function parseGitHubError(response: globalThis.Response) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message || `GitHub returned HTTP ${response.status}.`;
  } catch {
    return `GitHub returned HTTP ${response.status}.`;
  }
}

function isRequestSessionReady(req: Request, res: Response) {
  if (!isPublisherEnabled()) {
    res.sendStatus(404);
    return false;
  }
  if (!hasOAuthConfiguration()) {
    res.status(503).json({
      configured: false,
      authenticated: false,
      message: "GitHub publishing is not configured yet.",
    });
    return false;
  }
  if (!req.session.githubAccessToken || req.session.githubLogin !== allowedPublisher) {
    res.status(401).json({
      configured: true,
      authenticated: false,
      message: `Sign in to GitHub as ${allowedPublisher} to publish edits.`,
    });
    return false;
  }
  return true;
}

router.get("/portfolio/publisher/status", (req, res) => {
  if (!isPublisherEnabled()) return res.sendStatus(404);
  if (!hasOAuthConfiguration()) {
    return res.status(503).json({
      configured: false,
      authenticated: false,
      message: "GitHub publishing is not configured yet.",
    });
  }
  return res.json({
    configured: true,
    authenticated:
      Boolean(req.session.githubAccessToken) &&
      req.session.githubLogin === allowedPublisher,
    login: req.session.githubLogin ?? null,
  });
});

router.get("/portfolio/publisher/login", (req, res) => {
  if (!isPublisherEnabled()) return res.sendStatus(404);
  if (!hasOAuthConfiguration()) {
    return res.redirect("/?publisher=not-configured");
  }

  let callbackUrl: string;
  try {
    callbackUrl = getCallbackUrl();
  } catch (error) {
    req.log.error({ err: error }, "Portfolio publisher callback URL is unavailable");
    return res.redirect("/?publisher=not-configured");
  }

  const state = randomBytes(32).toString("hex");
  req.session.portfolioOAuthState = state;
  return req.session.save((error) => {
    if (error) {
      req.log.error({ err: error }, "Could not save GitHub OAuth state");
      return res.status(500).send("Could not start GitHub sign-in.");
    }

    const authorizationUrl = new URL("https://github.com/login/oauth/authorize");
    authorizationUrl.searchParams.set(
      "client_id",
      process.env.GITHUB_OAUTH_CLIENT_ID!,
    );
    authorizationUrl.searchParams.set("redirect_uri", callbackUrl);
    authorizationUrl.searchParams.set("scope", "public_repo");
    authorizationUrl.searchParams.set("state", state);
    return res.redirect(authorizationUrl.toString());
  });
});

router.get("/portfolio/publisher/callback", async (req, res) => {
  if (!isPublisherEnabled()) return res.sendStatus(404);
  if (!hasOAuthConfiguration()) {
    return res.redirect("/?publisher=not-configured");
  }

  if (req.query.error) return res.redirect("/?publisher=sign-in-cancelled");

  const state = typeof req.query.state === "string" ? req.query.state : "";
  const expectedState = req.session.portfolioOAuthState ?? "";
  delete req.session.portfolioOAuthState;
  if (!state || state !== expectedState) {
    return res.status(400).send("GitHub sign-in could not be verified. Please try again.");
  }

  const code = typeof req.query.code === "string" ? req.query.code : "";
  if (!code) return res.status(400).send("GitHub did not return a sign-in code.");

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Joshua-D-Parker-Portfolio",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
        client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
        code,
        redirect_uri: getCallbackUrl(),
      }),
    });
    const tokenData = (await tokenResponse.json()) as OAuthTokenResponse;
    if (!tokenResponse.ok || !tokenData.access_token) {
      req.log.warn(
        { statusCode: tokenResponse.status, oauthError: tokenData.error },
        "GitHub OAuth token exchange failed",
      );
      return res.redirect("/?publisher=sign-in-failed");
    }

    const userResponse = await fetch(`${githubApiBase}/user`, {
      headers: githubHeaders(tokenData.access_token),
    });
    if (!userResponse.ok) {
      req.log.warn(
        { statusCode: userResponse.status },
        "Could not verify the GitHub publisher account",
      );
      return res.redirect("/?publisher=sign-in-failed");
    }

    const user = (await userResponse.json()) as GitHubUser;
    if (user.login !== allowedPublisher) {
      return res.redirect("/?publisher=account-not-allowed");
    }

    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    req.session.githubAccessToken = tokenData.access_token;
    req.session.githubLogin = user.login;
    await new Promise<void>((resolve, reject) => {
      req.session.save((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    return res.redirect("/?publisher=connected");
  } catch (error) {
    req.log.error({ err: error }, "GitHub sign-in failed");
    return res.redirect("/?publisher=sign-in-failed");
  }
});

router.post("/portfolio/publisher/logout", (req, res) => {
  if (!isPublisherEnabled()) return res.sendStatus(404);
  if (rejectCrossOriginRequest(req, res)) return;

  return req.session.destroy((error) => {
    if (error) {
      req.log.error({ err: error }, "Could not end the GitHub publisher session");
      return res.status(500).json({ error: "Could not sign out." });
    }
    res.clearCookie("portfolio.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: Boolean(process.env.REPLIT_DEV_DOMAIN),
    });
    return res.json({ ok: true });
  });
});

router.post("/portfolio/publisher/publish", async (req, res) => {
  if (!isPublisherEnabled()) return res.sendStatus(404);
  if (rejectCrossOriginRequest(req, res)) return;
  if (!isRequestSessionReady(req, res)) return;

  const content = isRecord(req.body) ? req.body.content : undefined;
  if (!isEditableContent(content)) {
    return res.status(400).json({ error: "Portfolio content is missing required page data." });
  }

  const serializedContent = `${JSON.stringify(content, null, 2)}\n`;
  if (Buffer.byteLength(serializedContent, "utf8") > 1_000_000) {
    return res.status(413).json({ error: "Portfolio content must stay under 1 MB." });
  }

  const accessToken = req.session.githubAccessToken!;
  const fileUrl = `${githubApiBase}/repos/${repositoryOwner}/${repositoryName}/contents/${contentPath}`;

  try {
    const currentResponse = await fetch(`${fileUrl}?ref=main`, {
      headers: githubHeaders(accessToken),
    });
    if (!currentResponse.ok) {
      const message = await parseGitHubError(currentResponse);
      req.log.warn(
        { statusCode: currentResponse.status, githubMessage: message },
        "Could not read the currently published portfolio content",
      );
      return res.status(502).json({
        error: "Could not read the published portfolio file from GitHub.",
      });
    }

    const currentFile = (await currentResponse.json()) as GitHubFile;
    if (!currentFile.sha || !currentFile.content || currentFile.encoding !== "base64") {
      return res.status(502).json({ error: "GitHub returned an unexpected content file." });
    }

    const currentContent = Buffer.from(
      currentFile.content.replace(/\s/g, ""),
      "base64",
    ).toString("utf8");
    if (currentContent.trim() === serializedContent.trim()) {
      return res.json({ ok: true, changed: false, message: "The published content is already current." });
    }

    const updateResponse = await fetch(fileUrl, {
      method: "PUT",
      headers: {
        ...githubHeaders(accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Publish portfolio content from editor",
        content: Buffer.from(serializedContent, "utf8").toString("base64"),
        sha: currentFile.sha,
        branch: "main",
      }),
    });
    if (!updateResponse.ok) {
      const message = await parseGitHubError(updateResponse);
      req.log.warn(
        { statusCode: updateResponse.status, githubMessage: message },
        "GitHub rejected the portfolio content update",
      );
      return res.status(502).json({
        error:
          updateResponse.status === 409
            ? "The published file changed at the same time. Reload the current site content and try again."
            : "GitHub could not publish the portfolio content. Check repository permissions and try again.",
      });
    }

    const result = (await updateResponse.json()) as {
      commit?: { sha?: string };
    };
    return res.json({
      ok: true,
      changed: true,
      commit: result.commit?.sha ?? null,
      message: "Saved to GitHub. The published Viewer is rebuilding now.",
    });
  } catch (error) {
    req.log.error({ err: error }, "Portfolio content publishing failed");
    return res.status(502).json({
      error: "Could not reach GitHub. Your edits are still available in this editor.",
    });
  }
});

export default router;
