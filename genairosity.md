# Genairosity

This document describes the first steps to the establishment of the Genairosity project.

The Genairosity project describes efforts in creating FOSS clean room reimplementations of proprietary software.

It is inspired by the rust reimplementations of Adobe suite software by the getartcraft team https://getartcraft.com/apps , and is a counterpoint to something like Malus.sh. The name is a play on generative AI being used to generously give away proprietary software for free.

## TODOs

1. Clean out everything from this repo's devkit not related to the below TODOs or the overall goal of this particular repo
2. Establish in here a simple marketing website tracking the efforts of the various genairosity project
3. Use this repo's Github features (issues, projects, wiki, etc) to allow an Overseer frontier model agent coordinate efforts across various Genairosity projects and repos, including spinning up new repos as needed
4. Create a framework within this repo for suggesting and prioritizing proprietary software to target for clean room reimplementations
5. Use this repo's Github features to functional as canonical source of truth on various project statuses: e.g. Suggested, Accepted, Clean Room Description Created, Implementation Underway, and so on.

The goal is to have a framework wherein I, or anyone else with permissions to merge on this repo, can suggest software to be reimplemented, which then will kick off an automated process to create a repo for that project with a sufficiently minimal devkit that will describe the process of research, clean room scope gathering, planning and system design, and implementation, focused on agentic development (agnostic of tooling - users can clone repos, instruct their harness to `gh xyz` or read TODO file to get current status, and work on some slice of the project).

## Design principles

Genairosity software must be:

1. Legal - no illegal decompilation, no unlicensed proprietary blob usage
2. FOSS (AGPL-3 strongly preferred) from all angles - if server-side software is required, it must also be FOSS and self hostable
3. Non-commercial - the goal is to instigate a Free Culture attack on proprietary software. Manfred Macx theory of development.
4. Performant. Rust takes strong preference for implementation, Electron is almost certainly never the right choice. LLMs make this completely feasible.
5. Cross-platform where applicable (e.g. a desktop application can run on windows, mac, and Linux), with Linux as a first-class citizen and main priority, or Android for phone applications
6. As easy as, or easier, to use as the reference software. GIMP would not be aligned with this as a reimplementation of photoshop; gnu cash would not be aligned with this as a reimplementation of quickbooks desktop. Includes: design vibes looks good enough for normies
7. Come with no warranty
8. Not already implemented, or nearly implemented, by another project, who deserve our effort
9. Plug and play for AI needs - vision model needs can take API keys and URLs, or can run on local models through compatible local API (openAI API on localhost, ollama, etc)

## Examples of target software

1. CapCut - Proprietary photo and video editor targeting instagram and tik tok creators
2. Offline coding agent with local repo RAG (clean-rooming the indexing moat of Cursor/Windsurf, local backends) — the moat is server-side code intelligence; a local structural-graph indexer plus a 30B-class coder is very buildable on your 5090.
3. Bluebeam Revu - Deeply entrenched in architecture/construction for PDF markups, measurements, drawing sets and collaboration General PDF editors don't replicate the construction workflow well
4. LabVIEW - graphical FOSS instrumentation environment
5. FileMaker - to eventually allow organizations that have bizarre 20-year-old FileMaker applications that essentially are their information systems migrate to modern software, or export to other formats / tools

## Examples of software that should not be targeted

1. Altium Designer - KiCad is now excellent, so the main activist value is lossless Altium import/export, not cloning Altium itself. Work on KiCad instead.
2. Figma - Penpot already covers, and is funded by EU. Work on Penpot instead
