import {createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
import tinymce from 'tinymce';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default';
import 'tinymce/models/dom/model';



const {COMPONENT_DOM_READY, COMPONENT_PROPERTY_CHANGED , COMPONENT_ERROR_THROWN } = actionTypes;

const view = (state, {updateState}) => {
	let content = state.properties.content;
	return (

	<div>
		<div id="editor">
		</div>
	</div>
)};

createCustomElement('x-904640-tinymce-editor-component', {
	properties : {
		content : {
			"schema":{"type":"string"},
			"default":"Some content for <b>TinyMCE</b>"
		}
	},
	renderer: {type: snabbdom},
	view,
	styles,
	actionHandlers : {
		[COMPONENT_DOM_READY]: ({host,properties, dispatch, state})=>{
			console.log("State",state);
			const editor_element = host.shadowRoot.querySelector("#editor");
			let editor = tinymce.init({
				target: editor_element,
				skin: 'oxide',
				content_css: 'https://cdn.jsdelivr.net/npm/tinymce@7/skins/content/default/content.min.css',
				skin_url: 'https://cdn.jsdelivr.net/npm/tinymce@7/skins/ui/oxide',
				content_css_cors: true,
				promotion: false,
				menubar:false,
				setup: function (editor) {
					editor.on('init', function () {
						console.log("TinyMCE Editor should now be working just fine ....")
						editor.setContent(state.properties.content);
					});

					editor.on('input',()=>{
						dispatch("INPUT",{
							"content":editor.getContent()
						});
					})
					editor.on('change',()=>{
						dispatch("CHANGE",{
							"content":editor.getContent()
						});
					})
				}
			});


		},
		[COMPONENT_ERROR_THROWN]: (state)=>{
			console.log("Error thrown")
			console.log(state);
		}
	},
	dispatches : {
		'INPUT': {
			schema : {
				type: 'string',
				properties : {
					content : {type:'string'}
				}
			}
		},
		'CHANGE' : {
			schema: {
				type : 'string',
				properties : {
					content : { type : 'string'}
				}
			}
		},
		'ERROR' : {
			schema : {
				type:'string'
			}
		}
	}
});
