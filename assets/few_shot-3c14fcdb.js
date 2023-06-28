import{c as p,d as n,r as o,P as u}from"./index-6fed8408.js";class i extends p{constructor(e){if(super(e),Object.defineProperty(this,"examples",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"exampleSelector",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"examplePrompt",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"suffix",{enumerable:!0,configurable:!0,writable:!0,value:""}),Object.defineProperty(this,"exampleSeparator",{enumerable:!0,configurable:!0,writable:!0,value:`

`}),Object.defineProperty(this,"prefix",{enumerable:!0,configurable:!0,writable:!0,value:""}),Object.defineProperty(this,"templateFormat",{enumerable:!0,configurable:!0,writable:!0,value:"f-string"}),Object.defineProperty(this,"validateTemplate",{enumerable:!0,configurable:!0,writable:!0,value:!0}),Object.assign(this,e),this.examples!==void 0&&this.exampleSelector!==void 0)throw new Error("Only one of 'examples' and 'example_selector' should be provided");if(this.examples===void 0&&this.exampleSelector===void 0)throw new Error("One of 'examples' and 'example_selector' should be provided");if(this.validateTemplate){let t=this.inputVariables;this.partialVariables&&(t=t.concat(Object.keys(this.partialVariables))),n(this.prefix+this.suffix,this.templateFormat,t)}}_getPromptType(){return"few_shot"}async getExamples(e){if(this.examples!==void 0)return this.examples;if(this.exampleSelector!==void 0)return this.exampleSelector.selectExamples(e);throw new Error("One of 'examples' and 'example_selector' should be provided")}async partial(e){const t={...this};return t.inputVariables=this.inputVariables.filter(r=>!(r in e)),t.partialVariables={...this.partialVariables??{},...e},new i(t)}async format(e){const t=await this.mergePartialAndUserVariables(e),r=await this.getExamples(t),a=await Promise.all(r.map(s=>this.examplePrompt.format(s))),l=[this.prefix,...a,this.suffix].join(this.exampleSeparator);return o(l,this.templateFormat,t)}serialize(){if(this.exampleSelector||!this.examples)throw new Error("Serializing an example selector is not currently supported");if(this.outputParser!==void 0)throw new Error("Serializing an output parser is not currently supported");return{_type:this._getPromptType(),input_variables:this.inputVariables,example_prompt:this.examplePrompt.serialize(),example_separator:this.exampleSeparator,suffix:this.suffix,prefix:this.prefix,template_format:this.templateFormat,examples:this.examples}}static async deserialize(e){const{example_prompt:t}=e;if(!t)throw new Error("Missing example prompt");const r=await u.deserialize(t);let a;if(Array.isArray(e.examples))a=e.examples;else throw new Error("Invalid examples format. Only list or string are supported.");return new i({inputVariables:e.input_variables,examplePrompt:r,examples:a,exampleSeparator:e.example_separator,prefix:e.prefix,suffix:e.suffix,templateFormat:e.template_format})}}export{i as FewShotPromptTemplate};
