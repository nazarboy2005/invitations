# Samarqand peshtoqi source adaptation

- Source ID and slug: `samarqand-peshtoq`
- Source page: https://onlinetaklifnoma.app/templates/samarqand-peshtoq/full
- Untouched capture: `Invitations - this folder will be removed from production/OnlineTaklifnoma/Web invitations/onlinetaklifnoma.app/templates/samarqand-peshtoq/full/index.html`
- Captured style chunks and the interactive source page were inspected in the ChatGPT in-app browser. Source colors are parchment, deep indigo, turquoise tile, and muted gold; typography uses Great Vibes and Cormorant Garamond with Amiri for Arabic. The portal opening is a source video with a poster and source door art.
- Recovered 4 exact source media files (portal, portal thumbnail, couple art, opening video) and 19 exact font subsets. Direct source URLs and SHA-256 values are in `source/assets-provenance.json`.
- Adaptation keeps the Registan portal, full-screen video reveal, tiled indigo/turquoise borders, parchment invitation surface, script names, and couple artwork. It binds app wedding data, guest greeting, date/countdown/calendar, venue/map, program, gallery, contacts, gift, selected music, RSVP, private note, and wishes to saved invitation data and app APIs.
- Catalog preview uses default Emotional Piano. Demo fixture content is restricted to preview. No source demo venue, dates, names, tracking, or external submission endpoint is used in public output.
- Optional To‘yona is styled with the source palette and hidden unless enabled with a real card holder and number. Copy feedback is localized.
- Registration migration `0108_register_samarqand_peshtoqi.sql` creates an unpublished wedding template row.
