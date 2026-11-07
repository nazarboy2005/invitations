"""Package untouched captures; annotate their DOM for the separate platform bridge.

Run from the repository root with Python + beautifulsoup4. Missing originals are
recovered from their exact source URLs into production copies, never the archive.
"""
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString
from urllib.parse import urlparse, parse_qs, unquote
from urllib.request import urlopen, Request
import hashlib, json, re, shutil

ROOT = Path(__file__).resolve().parents[2]
ARCHIVE = ROOT.parent / 'Templates/Chorlove/Web invitations'
PUBLIC = ROOT / 'apps/web/public/templates'
IDS = {'stained-glass':'03_.3nabaa9co.js','sunset':'0hsbq8_n.u.b9.js','swan-garden':'0evg84uvcshki.js'}

def mark(node, key):
    if node:
        node['data-field'] = key
        node.clear()

def wrap_text(soup, node, key):
    tag = soup.new_tag('span', attrs={'data-field':key})
    node.replace_with(tag)
    return tag

for id, chunk in IDS.items():
    target = PUBLIC / id
    (target/'source').mkdir(parents=True,exist_ok=True)
    (target/'assets').mkdir(exist_ok=True)
    capture = ARCHIVE/f'templates/{id}/preview-frame.html'
    shutil.copy2(capture,target/'source/preview-frame.html')
    # Evidence only: source module is not executed with the provider app runtime.
    shutil.copy2(ARCHIVE/'_next/static/chunks'/chunk,target/'source/template-module.js')
    soup = BeautifulSoup(capture.read_text(encoding='utf8'),'html.parser')
    sections = soup.select('section')
    root = sections[0].find_parent('div',class_='sg-template') if id=='stained-glass' else sections[0].parent.parent.parent
    root['data-chorlove-template']=id
    root['style'] = 'visibility:hidden'
    root['aria-busy']='true'
    for audio in root.select('audio'):audio.decompose()
    if id!='stained-glass': sections[0].parent['data-scroll']=''
    configs = ['hero','countdown','scratch','invitation','venue','dress','program','gallery','gift','contacts','rsvp','wishes'] if id=='stained-glass' else ['hero','countdown','venue','program','dress','gift','gallery','wishes','rsvp','contacts','footer']
    for sec,key in zip(sections,configs):sec['data-section']=key
    opener=sections[0].select_one('button') if id=='stained-glass' else root.select_one('[role=button]')
    opener['data-chorlove-open']=''
    # Capture labels separately so all built-in text is localized by the bridge.
    labels=[]
    for node in list(root.descendants):
        if isinstance(node,NavigableString) and node.strip() and node.parent.name not in ['style','script']:
            value=node.strip()
            if value in ['Muhammad','Xadicha']:
                wrap_text(soup,node,'groom' if value=='Muhammad' else 'bride')
            elif value=='Muhammad & Xadicha':wrap_text(soup,node,'couple')
            elif value=='Muhammad O.':wrap_text(soup,node,'cardHolder')
            elif value=='5614 6887 1048 3529':wrap_text(soup,node,'cardNumber')
            elif value=='Abdurahmonovlar oilasi':wrap_text(soup,node,'hosts')
            elif value in ['16.12.2026','16 Dekabr 2026','16.12.2026 gacha']:
                wrap_text(soup,node,'date' if value=='16 Dekabr 2026' else 'dateNumeric')
            elif value=="Navro'z To'yxonasi":wrap_text(soup,node,'venueName')
            elif value=='Toshkent viloyati, Chirchiq shahri':wrap_text(soup,node,'address')
            elif value=="Sizni hayotimizdagi eng baxtli kun — to'yimizga taklif qilamiz":wrap_text(soup,node,'message')
            elif value=='Assalomu alaykum, aziz mehmon':wrap_text(soup,node,'greeting')
            else:
                tag=soup.new_tag('span',attrs={'data-copy':value});tag.string=value;node.replace_with(tag);labels.append(value)
    # All source sample wishes and media are removed; preview fixture supplies them.
    wishes=root.select_one('[data-section=wishes]')
    wishrow=wishes.select_one('ul li')
    wishrow['data-wish-row']=''
    for p,key in zip(wishrow.select('p'),['wishName','wishMessage']):mark(p,key)
    for li in wishes.select('ul li')[1:]:li.decompose()
    wishes.ul['data-wish-list']=''
    wishes.form['data-wish-form']=''
    rsvp=root.select_one('[data-section=rsvp]')
    rsvp.form['data-rsvp-form']=''
    # Program row markup remains source-specific; repeat rows by contract ID.
    program=root.select_one('[data-section=program]')
    for titletext in ['Mehmonlarni kutib olish','Nikoh marosimi','Bazm va tantana']:
        title=program.find('span',attrs={'data-copy':titletext})
        row=title.parent.parent.parent if id=='stained-glass' else title.find_parent('li')
        row['data-program-row']=''
        row.parent['data-program-list']=''
        for n in row.select('[data-copy]'):
            key='programTitle' if n['data-copy']==titletext else 'programTime'
            n.attrs={'data-field':key};n.clear()
    for n in root.select('[data-copy]'):
        dynamic={'16':'day','Dekabr':'month','2026':'year','18:00':'time'}
        if n['data-copy'] in dynamic:mark(n,dynamic[n['data-copy']]);n.attrs.pop('data-copy',None)
    gallery=root.select_one('[data-section=gallery]')
    cards=gallery.select('button:has(img)')
    if id=='stained-glass':
        cards[0].parent['data-gallery-grid']=''
        for c in cards:c['data-gallery-card']=''
    else:
        # Preserve the captured Embla viewport, track, slides and control layout.
        cards[0].parent.parent['data-gallery-track']=''
        cards[0].parent.parent.parent['data-gallery-viewport']=''
        for c in cards:c['data-gallery-card']=''
        controls=[b for b in gallery.select('button') if not b.select_one('img')]
        controls[0]['data-gallery-prev']='';controls[-1]['data-gallery-next']=''
        controls[1].parent['data-gallery-dots']=''
    for a in root.select('a'):
        href=a.get('href','')
        if 'chorlove.uz' in href and not any(x in href for x in ['instagram','t.me']):a.decompose();continue
        if 'yandex' in href:a['data-map']='';a['href']='#'
        elif 'calendar.google' in href:a['data-calendar']='';a['href']='#'
        else:
            a['data-contact']='phone' if href.startswith('tel:') else 'telegram' if 't.me/' in href else 'instagram'
            a['href']='#'
        a['rel']='noopener noreferrer'
    for x in root.select('[data-copy]'):
        if any(t in x['data-copy'] for t in ['chorlove','+998 90','@chorlove']):x.clear();x.attrs={'data-contact-value':''}
    for inp in root.select('input,textarea'):
        inp.attrs.pop('value',None);inp.attrs.pop('placeholder',None);inp.attrs.pop('aria-label',None)
    # Mark motion before removing captured initial styles. Source CSS ornaments
    # and keyframes remain unchanged; the standalone motion adapter drives reveals.
    for x in root.select('[style]'):
        style=x.get('style','')
        if re.search(r'opacity:\s*0(?:;|$)',style):
            x['data-reveal']=''
            x['data-initial']=style
            x['style']=re.sub(r'(?:opacity|transform|filter):[^;]+;?', '', style)
    # Hero copy waits for the source opening sequence, rather than intersection.
    for x in sections[0].select('[data-reveal]'):x['data-hero-reveal']=''
    assets=[]
    def local(url):
        if url.startswith('/_next/image?'):url=parse_qs(urlparse(url).query)['url'][0]
        if not url.startswith('/images/'):return url
        relative=url.lstrip('/')
        dest=target/'assets'/Path(relative).name
        source=ARCHIVE/relative
        origin='archive'
        if source.exists():shutil.copy2(source,dest)
        elif not dest.exists():
            print('Recover',id,relative,flush=True)
            data=urlopen(Request('https://chorlove.uz/'+relative,headers={'User-Agent':'Mozilla/5.0'}),timeout=45).read()
            if data.startswith(b'<!'):raise RuntimeError('Asset returned HTML: '+relative)
            dest.write_bytes(data);origin='recovered-original'
        else:origin='recovered-original'
        assets.append({'file':'assets/'+dest.name,'archiveFile':relative,'origin':origin,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()})
        return f'/templates/{id}/assets/{dest.name}'
    for x in root.select('[src],[poster],[srcset]'):
        if x.name=='iframe':
            x.attrs.pop('src',None);x['data-venue-frame']='';continue
        for attr in ['src','poster']:
            if x.get(attr):x[attr]=local(x[attr])
        x.attrs.pop('srcset',None)
    for x in root.select('[style*="url("]'):
        x['style']=re.sub(r'url\(([^)]+)\)',lambda m:'url('+local(m[1].strip('"\''))+')',x['style'])
    for x in root.select('[data-gallery-card] img'):
        x.attrs.pop('src',None)
    if id=='stained-glass':
        x=root.select_one('img[src$="couple-scratch-inspo.webp"]')
        x['data-scratch-photo']='';x.attrs.pop('src',None)
    # All CSS/font resources live under the existing local captured vendor package.
    links=[]
    for x in soup.select('link[rel=stylesheet]'):
        href=x['href'];links.append(f'<link rel="stylesheet" href="/templates/chorlove/shared{href}">')
    for style in root.select('style'):pass
    bodyclass=' '.join(soup.body.get('class',[]))
    extra=''.join(str(x) for x in soup.select('style') if x not in root.descendants)
    html=f'<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>{id} invitation</title>'+''.join(links)+extra+'<link rel="stylesheet" href="/templates/chorlove/shared/three-adapter.css"></head>'+f'<body class="{bodyclass}">'+str(root)+f'<script src="/templates/{id}/motion.js"></script><script src="/templates/chorlove/shared/three-carousel.js"></script><script src="/templates/chorlove/shared/three-lightbox.js"></script><script src="/templates/chorlove/shared/three-bridge.js"></script></body></html>'
    # BeautifulSoup lowercases SVG attributes; restore case-sensitive SVG names.
    for low,proper in [('viewbox','viewBox'),('preserveaspectratio','preserveAspectRatio'),('clippathunits','clipPathUnits'),('gradientunits','gradientUnits'),('gradienttransform','gradientTransform')]:html=html.replace(low+'=',proper+'=')
    (target/'index.html').write_text(html,encoding='utf8')
    (target/'source-provenance.json').write_text(json.dumps({'id':id,'captureSha256':hashlib.sha256(capture.read_bytes()).hexdigest(),'moduleSha256':hashlib.sha256((target/'source/template-module.js').read_bytes()).hexdigest(),'assets':list({a['file']:a for a in assets}.values())},indent=2),encoding='utf8')
    print(id,'packaged',len(assets),'asset references',flush=True)
