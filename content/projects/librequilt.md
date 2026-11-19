# librequilt

Quilters who design their own quilts draw blocks, lay them out, try fabrics, and print a chart of how much fabric to buy and how to cut it. This project is actively developing a free, browser-based tool for that loop.

## Scope

The approved first-release scope covers a block editor, a small library of traditional straight-seam blocks, straight and on-point quilt layouts, colouring with solids or the quilter's own fabric photos, printable PDF/SVG yardage and cutting charts, and an open, editable project format. It excludes foundation paper piecing, opening the incumbent's project files, export to quilting machines, and manufacturers' fabric images.

The application is web-only TypeScript for current browsers on Windows, macOS, iPadOS, ChromeOS and Linux. Designs and fabric photos stay on the quilter's device; the approved specification requires offline editing and export after an initial online load.

## Development status

Implementation is the active project phase following the maintainer's [specification approval on 2026-11-19](https://github.com/508-dev/librequilt/pull/3#issuecomment-7002479585). The approval names commit `b358fef4ed8c3a0c3c0a9a0419ab408ab3831d8c`, recorded in the project's [approval metadata](https://github.com/508-dev/librequilt/blob/main/genairosity.json). The approved specification defines the implementation contract; this status does not imply a usable release.

## Current limitations

As of 2026-11-19, no application code or release has landed. Physical sewing and print checks, user testing, iPad performance measurements, and source verification for the library blocks remain release gates, not completed results.

## Links

- [Nomination and reviewed research](https://github.com/508-dev/genairosity/issues/71)
- [Charter](https://github.com/508-dev/librequilt/blob/main/docs/charter.md)
- [Approved functional specification](https://github.com/508-dev/librequilt/blob/b358fef4ed8c3a0c3c0a9a0419ab408ab3831d8c/docs/specification.md)
- [Platform and scope decisions](https://github.com/508-dev/librequilt/blob/main/docs/decisions.md)
- [Research and evidence register](https://github.com/508-dev/librequilt/blob/main/docs/research.md)

## Contributing

Read the approved specification, charter, and the project's [contribution process](https://github.com/508-dev/librequilt/blob/main/CONTRIBUTING.md). Coordinate bounded implementation work in the [project issue tracker](https://github.com/508-dev/librequilt/issues), with acceptance criteria and verification tied to the specification.
