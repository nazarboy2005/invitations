-- Display names only: retain stable IDs, selections, prices and publication flags.
UPDATE templates
SET name = trim(regexp_replace(
  regexp_replace(name,
    '^(Taklifnomachi|Taklifla|Invitate|Chorlove|Wedivo|Marxaba|Onlinetaklifnoma|E-invitation)([[:space:]·—–-])+',
    '', 'i'),
  '([[:space:]·—–-])+edition$', '', 'i'))
WHERE name ~* '^(Taklifnomachi|Taklifla|Invitate|Chorlove|Wedivo|Marxaba|Onlinetaklifnoma|E-invitation)([[:space:]·—–-])'
   OR name ~* '([[:space:]·—–-])+edition$';

-- Align legacy fallback wording with the existing neutral catalog identities.
UPDATE templates SET name = CASE id
  WHEN 'invitate-palov' THEN 'Osh ziyofati'
  WHEN 'invitate-nahorgi-osh' THEN 'Sahar ziyofati'
  WHEN 'invitate-wedding' THEN 'Gulchambar'
  WHEN 'taklifnomachi-1' THEN 'Klassik nafis'
  WHEN 'taklifnomachi-15' THEN 'Monoxrom'
  WHEN 'taklifnomachi-17' THEN 'Atlas ipak'
  WHEN 'taklifnomachi-19' THEN 'Zaytun bog‘i'
END
WHERE (id, name) IN (
  ('invitate-palov', 'Palov'),
  ('invitate-nahorgi-osh', 'Nahorgi Osh'),
  ('invitate-wedding', 'Wedding'),
  ('taklifnomachi-1', 'Klassik'),
  ('taklifnomachi-15', 'Monoxrom swap'),
  ('taklifnomachi-17', 'Atlas va atlas ipak'),
  ('taklifnomachi-19', 'Zaytun bogi')
);
