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
 * @fileoverview  Implements the AsciiMath InputJax object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {AbstractInputJax} from '../core/InputJax.js';
import {LegacyAsciiMath} from '../../mathjax2/input/AsciiMath.js';
import {separateOptions, OptionList} from '../util/Options.js';
import {MathItem} from '../core/MathItem.js';

import {FindAsciiMath} from './asciimath/FindAsciiMath.js';

/*****************************************************************/
/*
 *  Implements the AsciiMath class (extends AbstractInputJax)
 */

/*
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class AsciiMath<N, T, D> extends AbstractInputJax<N, T, D> {

    public static NAME: string = 'AsciiMath';
    public static OPTIONS: OptionList = {
        ...AbstractInputJax.OPTIONS,
        FindAsciiMath: null
    };

    /*
     * The FindMath object used to search for AsciiMath in the document
     */
    protected findAsciiMath: FindAsciiMath<N, T, D>;

    /*
     * @override
     */
    constructor(options: OptionList) {
        let [am, find] = separateOptions(options, FindAsciiMath.OPTIONS);
        super(am);
        this.findAsciiMath = this.options['FindAsciiMath'] || new FindAsciiMath(find);
    }

    /*
     * Use legacy AsciiMath input jax for now
     *
     * @override
     */
    public compile(math: MathItem<N, T, D>) {
        return LegacyAsciiMath.Compile(math.math, math.display);
    }

    /*
     * @override
     */
    public findMath(strings: string[]) {
        return this.findAsciiMath.findMath(strings);
    }

}
