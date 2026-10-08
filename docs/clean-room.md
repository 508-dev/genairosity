# Research and independent implementation

This is an operational evidence policy, not target-specific legal clearance.
Fresh model contexts do not establish anything about a model's training data.
The current process is deliberately limited; ambiguous inputs require maintainer
review before use. Consult qualified advice when a target-specific legal question
cannot be resolved from reliable evidence.

## 1. Research inputs and provenance

Use public documentation and lawfully observed behavior. Record a source identifier,
URL or acquisition method, access date, applicable license/terms or uncertainty,
observed fact, and what it supports. Public availability is not itself permission
to copy. Prefer links and original descriptions; retain only evidence you may retain.
Use synthetic data and your own test files for observations.

When publishing in a GitHub issue, format GitHub issue URLs and shorthand issue
references as inline code rather than active links to avoid unwanted backlinks.
Links to ordinary public documentation and source repositories remain useful
provenance.

Do not use leaked or proprietary source, unlicensed proprietary blobs/assets, NDA
material, decompilation, circumvention, or access you are not authorized to exercise.
Do not upload uncertain material to an issue, model provider, or git. Record a brief
non-sensitive description of the uncertainty and request review instead.

Survey existing FOSS before proposing new code. Document what fits, what is missing,
and whether an upstream contribution would serve the workflow better.

## 2. Functional specification

Write an original account of user workflows, inputs/outputs, observable behavior,
edge cases, accessibility/usability needs, performance targets, platform requirements,
and acceptance tests. Link evidence by identifier. Separate observed facts from
inferences and proposed improvements. Identify excluded features and unresolved questions.
Do not copy reference source, proprietary assets, branding, or expressive UI details.
An approachable workflow can have its own visual design.

## 3. Review boundary

The maintainer reviews provenance, scope, uncertainty, and acceptance criteria, then
records approval in a GitHub issue/PR tied to the exact specification commit. Put
`reviewer`, `date`, `url`, and `commit` in `genairosity.json.specificationApproval`.
Approval applies to that revision; material scope or evidence changes need fresh approval.
A research-stage project may register with approval set to null.

## 4. Implementation boundary

Start implementation in a separate context using the reviewed specification and
permitted FOSS dependencies. Do not carry research transcripts, proprietary source,
or uncertain evidence into implementation prompts. Keep research records available
for reviewers; explicit session inputs define the intended boundary, not a claim
that people can forget prior knowledge. Record any reference-code exposure for review.

Implementers request specification clarification when needed instead of independently
importing uncertain reference material. Preserve licenses and source records for
FOSS dependencies. Contributors may work without AI; the same evidence rules apply.

## 5. Verification and release

Verify against the approved acceptance criteria using synthetic or permitted fixtures.
Report actual results and limitations. Before calling a scope usable, link reproducible
checks, distribution/source instructions, license notices, and a security-reporting route.
Human review of substance remains necessary even when structural checks pass.

Background: [EFF reverse-engineering FAQ](https://www.eff.org/issues/coders/reverse-engineering-faq)
and [GNU's free-software definition](https://www.gnu.org/philosophy/free-sw.en.html).
Their guidance does not replace review of a particular target or jurisdiction.
