import { CLI } from "../lib/core";
// CLI
import { About } from "./cli/about";
import { Apps } from "./cli/apps";
import { Deploy } from "./cli/deploy";
import { Login } from "./cli/login";
import { Logout } from "./cli/logout";

new CLI(Login, Logout, Deploy, Apps, About);