import {createTemplatePreviewSample} from "../apps/web/src/modules/catalog/preview-sample";
import {makeYubileySahifasiPayload} from "../apps/web/src/templates/taklifla-yubiley-sahifasi/adapter";
const invitation=createTemplatePreviewSample("taklifla-yubiley-sahifasi");console.log(JSON.stringify({invitation,message:makeYubileySahifasiPayload(invitation,"uz-Latn",{invitationId:"navy-qa",preview:true})}));
