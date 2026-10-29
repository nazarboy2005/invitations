import {createTemplatePreviewSample} from "../apps/web/src/modules/catalog/preview-sample";
import {makeXonadonPayload} from "../apps/web/src/templates/taklifla-fayzli-xonadon/adapter";
const invitation=createTemplatePreviewSample("taklifla-fayzli-xonadon");console.log(JSON.stringify({invitation,message:makeXonadonPayload(invitation,"uz-Latn",{invitationId:"xonadon-qa",preview:true})}));
