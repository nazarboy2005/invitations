# Studio input support audit

The input matrix covers all 134 database templates, including published and unpublished entries. Capabilities control Studio visibility, renderer projection, field limits, and server validation. Designs without a renderer fail closed.

Unsupported new or edited fields are rejected by the backend. Previously saved hidden content can remain unchanged or be cleared, so switching designs does not destroy authored content. New hidden browser content is retained locally until a compatible design is selected.

Verification includes 47 focused contract and regression tests, a renderer inspection of 122 web templates, and authenticated HTTP checks for 64 templates. HTTP checks were shortened at the user's request; they are not claimed for every database row. See `api-verification.json` and the input matrix for evidence and scope. Renderer observation files record the audit findings before the final capability corrections.
