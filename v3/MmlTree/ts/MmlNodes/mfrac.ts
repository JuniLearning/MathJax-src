/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  Implements the MmlMfrac node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../Node.js';
import {MmlNode, AMmlBaseNode, AttributeList} from '../MmlNode.js';

/*****************************************************************/
/*
 *  Implements the MmlMfrac node class (subclass of AMmlBaseNode)
 */

export class MmlMfrac extends AMmlBaseNode {
    public static defaults: PropertyList = {
        ...AMmlBaseNode.defaults,
        linethickness: 'medium',
        numalign: 'center',
        denomalign: 'center',
        bevelled: false
    };

    /*
     * @return {string}  The mfrac kind
     */
    public get kind() {
        return 'mfrac';
    }

    /*
     * @return {number}  <mfrac> requires two children
     */
    public get arity() {
        return 2;
    }

    /*
     * @return {boolean}  The children of <mfrac> can include line breaks
     */
    public get linebreakContainer() {
        return true;
    }

    /*
     * Update the children separately, and if embellished, update from the core
     *
     * @override
     */
    public setTeXclass(prev: MmlNode) {
        this.getPrevClass(prev);
        for (const child of this.childNodes) {
            child.setTeXclass(null);
        }
        if (this.isEmbellished) {
            this.updateTeXclass(this.core());
        }
        return this;
    }

    /*
     * Adjust the display level, and use prime style in denominator
     *
     * @override
     */
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
        if (!display || level > 0) {
            level++;
        }
        this.childNodes[0].setInheritedAttributes(attributes, false, level, prime);
        this.childNodes[1].setInheritedAttributes(attributes, false, level, true);
    }
}
