import {createTemplatePreviewSample} from "../apps/web/src/modules/catalog/preview-sample";
import {makeErtakPayload} from "../apps/web/src/templates/ertak/adapter";
const invitation=createTemplatePreviewSample("ertak");console.log(JSON.stringify({invitation,message:makeErtakPayload(invitation,"uz-Latn",{invitationId:"ertak-qa",preview:true,sampleWishes:true})}));
