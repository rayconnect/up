import { CLI } from "../lib/core";
// CLI
import { About } from "./cli/about";
import { Apps } from "./cli/apps";
import { Deploy } from "./cli/deploy";
import { Login } from "./cli/login";

new CLI(About, Login, Apps, Deploy);