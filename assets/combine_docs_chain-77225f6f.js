import{B as h,L as m,P as I}from"./index-6fed8408.js";class d extends h{get inputKeys(){return[this.inputKey,...this.llmChain.inputKeys]}get outputKeys(){return this.llmChain.outputKeys}constructor(e){super(e),Object.defineProperty(this,"llmChain",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"inputKey",{enumerable:!0,configurable:!0,writable:!0,value:"input_documents"}),Object.defineProperty(this,"documentVariableName",{enumerable:!0,configurable:!0,writable:!0,value:"context"}),this.llmChain=e.llmChain,this.documentVariableName=e.documentVariableName??this.documentVariableName,this.inputKey=e.inputKey??this.inputKey}async _call(e,t){if(!(this.inputKey in e))throw new Error(`Document key ${this.inputKey} not found.`);const{[this.inputKey]:n,...i}=e,u=n.map(({pageContent:o})=>o).join(`

`);return await this.llmChain.call({...i,[this.documentVariableName]:u},t?.getChild())}_chainType(){return"stuff_documents_chain"}static async deserialize(e){if(!e.llm_chain)throw new Error("Missing llm_chain");return new d({llmChain:await m.deserialize(e.llm_chain)})}serialize(){return{_type:this._chainType(),llm_chain:this.llmChain.serialize()}}}class f extends h{get inputKeys(){return[this.inputKey,...this.combineDocumentChain.inputKeys]}get outputKeys(){return this.combineDocumentChain.outputKeys}constructor(e){super(e),Object.defineProperty(this,"llmChain",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"inputKey",{enumerable:!0,configurable:!0,writable:!0,value:"input_documents"}),Object.defineProperty(this,"documentVariableName",{enumerable:!0,configurable:!0,writable:!0,value:"context"}),Object.defineProperty(this,"returnIntermediateSteps",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"maxTokens",{enumerable:!0,configurable:!0,writable:!0,value:3e3}),Object.defineProperty(this,"maxIterations",{enumerable:!0,configurable:!0,writable:!0,value:10}),Object.defineProperty(this,"ensureMapStep",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"combineDocumentChain",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.llmChain=e.llmChain,this.combineDocumentChain=e.combineDocumentChain,this.documentVariableName=e.documentVariableName??this.documentVariableName,this.ensureMapStep=e.ensureMapStep??this.ensureMapStep,this.inputKey=e.inputKey??this.inputKey,this.maxTokens=e.maxTokens??this.maxTokens,this.maxIterations=e.maxIterations??this.maxIterations,this.returnIntermediateSteps=e.returnIntermediateSteps??!1}async _call(e,t){if(!(this.inputKey in e))throw new Error(`Document key ${this.inputKey} not found.`);const{[this.inputKey]:n,...i}=e;let a=n,u=[];for(let c=0;c<this.maxIterations;c+=1){const l=a.map(s=>({[this.documentVariableName]:s.pageContent,...i})),_=l.map(async s=>{const p=await this.llmChain.prompt.format(s);return this.llmChain.llm.getNumTokens(p)}),C=await Promise.all(_).then(s=>s.reduce((p,P)=>p+P,0)),g=c!==0||!this.ensureMapStep,K=C<this.maxTokens;if(g&&K)break;const b=await this.llmChain.apply(l,t?[t.getChild()]:void 0),{outputKey:y}=this.llmChain;this.returnIntermediateSteps&&(u=u.concat(b.map(s=>s[y]))),a=b.map(s=>({pageContent:s[y]}))}const r={input_documents:a,...i},o=await this.combineDocumentChain.call(r,t?.getChild());return this.returnIntermediateSteps?{...o,intermediateSteps:u}:o}_chainType(){return"map_reduce_documents_chain"}static async deserialize(e){if(!e.llm_chain)throw new Error("Missing llm_chain");if(!e.combine_document_chain)throw new Error("Missing combine_document_chain");return new f({llmChain:await m.deserialize(e.llm_chain),combineDocumentChain:await h.deserialize(e.combine_document_chain)})}serialize(){return{_type:this._chainType(),llm_chain:this.llmChain.serialize(),combine_document_chain:this.combineDocumentChain.serialize()}}}class w extends h{get defaultDocumentPrompt(){return new I({inputVariables:["page_content"],template:"{page_content}"})}get inputKeys(){return[this.inputKey,...this.refineLLMChain.inputKeys]}get outputKeys(){return[this.outputKey]}constructor(e){super(e),Object.defineProperty(this,"llmChain",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"inputKey",{enumerable:!0,configurable:!0,writable:!0,value:"input_documents"}),Object.defineProperty(this,"outputKey",{enumerable:!0,configurable:!0,writable:!0,value:"output_text"}),Object.defineProperty(this,"documentVariableName",{enumerable:!0,configurable:!0,writable:!0,value:"context"}),Object.defineProperty(this,"initialResponseName",{enumerable:!0,configurable:!0,writable:!0,value:"existing_answer"}),Object.defineProperty(this,"refineLLMChain",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"documentPrompt",{enumerable:!0,configurable:!0,writable:!0,value:this.defaultDocumentPrompt}),this.llmChain=e.llmChain,this.refineLLMChain=e.refineLLMChain,this.documentVariableName=e.documentVariableName??this.documentVariableName,this.inputKey=e.inputKey??this.inputKey,this.outputKey=e.outputKey??this.outputKey,this.documentPrompt=e.documentPrompt??this.documentPrompt,this.initialResponseName=e.initialResponseName??this.initialResponseName}async _constructInitialInputs(e,t){const n={page_content:e.pageContent,...e.metadata},i={};return this.documentPrompt.inputVariables.forEach(r=>{i[r]=n[r]}),{...{[this.documentVariableName]:await this.documentPrompt.format({...i})},...t}}async _constructRefineInputs(e,t){const n={page_content:e.pageContent,...e.metadata},i={};this.documentPrompt.inputVariables.forEach(r=>{i[r]=n[r]});const a={[this.documentVariableName]:await this.documentPrompt.format({...i})};return{[this.initialResponseName]:t,...a}}async _call(e,t){if(!(this.inputKey in e))throw new Error(`Document key ${this.inputKey} not found.`);const{[this.inputKey]:n,...i}=e,a=n,u=await this._constructInitialInputs(a[0],i);let r=await this.llmChain.predict({...u},t?.getChild());for(let o=1;o<a.length;o+=1){const l={...await this._constructRefineInputs(a[o],r),...i};r=await this.refineLLMChain.predict({...l},t?.getChild())}return{[this.outputKey]:r}}_chainType(){return"refine_documents_chain"}static async deserialize(e){const t=e.llm_chain;if(!t)throw new Error("Missing llm_chain");const n=e.refine_llm_chain;if(!n)throw new Error("Missing refine_llm_chain");return new w({llmChain:await m.deserialize(t),refineLLMChain:await m.deserialize(n)})}serialize(){return{_type:this._chainType(),llm_chain:this.llmChain.serialize(),refine_llm_chain:this.refineLLMChain.serialize()}}}export{f as MapReduceDocumentsChain,w as RefineDocumentsChain,d as StuffDocumentsChain};