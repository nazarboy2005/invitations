-- Display-only correction. Storage IDs, publication, prices and invitations stay intact.
UPDATE templates SET name = CASE id
  WHEN 'invitate-palov' THEN 'Osh ziyofati'
  WHEN 'invitate-nahorgi-osh' THEN 'Sahar ziyofati'
  WHEN 'invitate-wedding' THEN 'Gulchambar'
  WHEN 'palov' THEN 'Palov'
  WHEN 'taklifnomachi-1' THEN 'Klassik nafis'
  WHEN 'taklifnomachi-12' THEN 'Moviy osmon'
  WHEN 'taklifnomachi-13' THEN 'Oltin atirgul'
  WHEN 'taklifnomachi-15' THEN 'Monoxrom'
  WHEN 'taklifnomachi-16' THEN 'Zaytun guli'
  WHEN 'taklifnomachi-17' THEN 'Atlas ipak'
  WHEN 'taklifnomachi-18' THEN 'Gul naqshli marosim'
  WHEN 'taklifnomachi-19' THEN 'Zaytun bogi'
  ELSE name
END
WHERE name ~* '^(Taklifnomachi|Taklifla|Invitate|Chorlove|Wedivo|Marxaba|Onlinetaklifnoma)([[:space:]]|[·—–-])';
