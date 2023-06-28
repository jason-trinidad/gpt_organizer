import{B as l}from"./index-6fed8408.js";function b(s,e){const t=new Set;for(const i of e)s.has(i)&&t.add(i);return t}function d(s,e){const t=new Set(s);for(const i of e)t.add(i);return t}function h(s,e){const t=new Set(s);for(const i of e)t.delete(i);return t}function u(s){return Array.from(s).map(e=>`"${e}"`).join(", ")}class f extends l{get inputKeys(){return this.inputVariables}get outputKeys(){return this.outputVariables}constructor(e){if(super(e),Object.defineProperty(this,"chains",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"inputVariables",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"outputVariables",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"returnAll",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.chains=e.chains,this.inputVariables=e.inputVariables,this.outputVariables=e.outputVariables??[],this.outputVariables.length>0&&e.returnAll)throw new Error("Either specify variables to return using `outputVariables` or use `returnAll` param. Cannot apply both conditions at the same time.");this.returnAll=e.returnAll??!1,this._validateChains()}_validateChains(){if(this.chains.length===0)throw new Error("Sequential chain must have at least one chain.");const e=this.memory?.memoryKeys??[],t=new Set(this.inputKeys),i=new Set(e),a=b(t,i);if(a.size>0)throw new Error(`The following keys: ${u(a)} are overlapping between memory and input keys of the chain variables. This can lead to unexpected behaviour. Please use input and memory keys that don't overlap.`);const r=d(t,i);for(const n of this.chains){const o=h(new Set(n.inputKeys),r);if(o.size>0)throw new Error(`Missing variables for chain "${n._chainType()}": ${u(o)}. Only got the following variables: ${u(r)}.`);const c=new Set(n.outputKeys),p=b(r,c);if(p.size>0)throw new Error(`The following output variables for chain "${n._chainType()}" are overlapping: ${u(p)}. This can lead to unexpected behaviour.`);for(const w of c)r.add(w)}if(this.outputVariables.length===0)if(this.returnAll){const n=h(r,t);this.outputVariables=Array.from(n)}else this.outputVariables=this.chains[this.chains.length-1].outputKeys;else{const n=h(new Set(this.outputVariables),new Set(r));if(n.size>0)throw new Error(`The following output variables were expected to be in the final chain output but were not found: ${u(n)}.`)}}async _call(e,t){let i=e;const a={};for(const n of this.chains){i=await n.call(i,t?.getChild());for(const o of Object.keys(i))a[o]=i[o]}const r={};for(const n of this.outputVariables)r[n]=a[n];return r}_chainType(){return"sequential_chain"}static async deserialize(e){const t=[],i=e.input_variables,a=e.output_variables,r=e.chains;for(const n of r){const o=await l.deserialize(n);t.push(o)}return new f({chains:t,inputVariables:i,outputVariables:a})}serialize(){const e=[];for(const t of this.chains)e.push(t.serialize());return{_type:this._chainType(),input_variables:this.inputVariables,output_variables:this.outputVariables,chains:e}}}class y extends l{get inputKeys(){return[this.inputKey]}get outputKeys(){return[this.outputKey]}constructor(e){super(e.memory,e.verbose,e.callbacks??e.callbackManager),Object.defineProperty(this,"chains",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"inputKey",{enumerable:!0,configurable:!0,writable:!0,value:"input"}),Object.defineProperty(this,"outputKey",{enumerable:!0,configurable:!0,writable:!0,value:"output"}),Object.defineProperty(this,"trimOutputs",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.chains=e.chains,this.trimOutputs=e.trimOutputs??!1,this._validateChains()}_validateChains(){for(const e of this.chains){if(e.inputKeys.length!==1)throw new Error(`Chains used in SimpleSequentialChain should all have one input, got ${e.inputKeys.length} for ${e._chainType()}.`);if(e.outputKeys.length!==1)throw new Error(`Chains used in SimpleSequentialChain should all have one output, got ${e.outputKeys.length} for ${e._chainType()}.`)}}async _call(e,t){let i=e[this.inputKey];for(const a of this.chains)i=await a.run(i,t?.getChild()),this.trimOutputs&&(i=i.trim()),await t?.handleText(i);return{[this.outputKey]:i}}_chainType(){return"simple_sequential_chain"}static async deserialize(e){const t=[],i=e.chains;for(const a of i){const r=await l.deserialize(a);t.push(r)}return new y({chains:t})}serialize(){const e=[];for(const t of this.chains)e.push(t.serialize());return{_type:this._chainType(),chains:e}}}export{f as SequentialChain,y as SimpleSequentialChain};
