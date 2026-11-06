import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require=createRequire(import.meta.url);
require.extensions[".css"]=()=>{};
async function main(){
const {createTemplatePreviewSample}=await import("../../../apps/web/src/modules/catalog/preview-sample");
const {makeRiwayatPayload}=await import("../../../apps/web/src/templates/wedivo-riwayat-obrolan/adapter");
const data=Object.fromEntries((["uz-Latn","uz-Cyrl","en","ru"] as const).map(locale=>{
 const invitation=createTemplatePreviewSample("wedivo-riwayat-obrolan");
 return [locale,makeRiwayatPayload(invitation,locale,"",{invitationId:"riwayat-qa",preview:true,sampleWishes:true})];
}));
writeFileSync("apps/web/public/templates/wedivo-riwayat-obrolan/.qa-payload.json",JSON.stringify(data));
}
main();
