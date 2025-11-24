#!/usr/bin/env node

import Kernel from "./Kernel.js";

// Handle console commands
Kernel.handle(process.argv);
