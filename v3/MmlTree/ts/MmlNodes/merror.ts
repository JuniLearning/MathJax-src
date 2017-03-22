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
 * @fileoverview  Implements the MmlMerror node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../Node.js';
import {AMmlNode, TEXCLASS} from '../MmlNode.js';

/*****************************************************************/
/*
 *  Implements the MmlMerror node class (subclass of AMmlNode)
 */

export class MmlMerror extends AMmlNode {
    public static defaults: PropertyList = {
        ...AMmlNode.defaults
    };
    public texClass = TEXCLASS.ORD;

    /*
     * @return {string}  The merror kind
     */
    public get kind() {
        return 'merror';
    }

    /*
     * @return {number}  <merror> gets an inferred mrow
     */
    public get arity() {
        return -1;
    }

    /*
     * @return {boolean}  <merror> can contain line breaks
     */
    public get linebreakContainer() {
        return true;
    }
}
