import {createTemplatePreviewSample} from "../apps/web/src/modules/catalog/preview-sample";
import {makeYubileySahifasiPayload} from "../apps/web/src/templates/umr-bahori/adapter";
const invitation=createTemplatePreviewSample("umr-bahori");console.log(JSON.stringify({invitation,message:makeYubileySahifasiPayload(invitation,"uz-Latn",{invitationId:"navy-qa",preview:true})}));
