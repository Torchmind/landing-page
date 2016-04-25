/*
 * Copyright 2016 Johannes Donath <johannesd@torchmind.com>
 * and other copyright owners as documented in the project's IP log.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Color
 *
 * Represents an RGBA color value.
 */
export class Color {
        private _red : number;
        private _green : number;
        private _blue : number;
        private _alpha : number;

        constructor(red : number = 255, green : number = 255, blue : number = 255, alpha : number = 255) {
                this._red = red;
                this._green = green;
                this._blue = blue;
                this._alpha = alpha;
        }

        public clone() : Color {
                return new Color(this._red, this._green, this._blue, this._alpha);
        }

        get red() : number {
                return this._red;
        }

        set red(value : number) {
                this._red = value;
        }

        get green() : number {
                return this._green;
        }

        set green(value : number) {
                this._green = value;
        }

        get blue() : number {
                return this._blue;
        }

        set blue(value : number) {
                this._blue = value;
        }

        get alpha() : number {
                return this._alpha;
        }

        set alpha(value : number) {
                this._alpha = value;
        }

        get string() : string {
                return 'rgba(' + this._red + ', ' + this._green + ', ' + this._blue + ', ' + (this._alpha / 255) + ')';
        }

        set string(value : string) {
                if (value.charAt(0) != '#') {
                        throw new Error('Colors must begin with a #');
                }

                this._red = Number.parseInt('0x' + value.substr(1, 2));
                this._green = Number.parseInt('0x' + value.substr(3, 2));
                this._blue = Number.parseInt('0x' + value.substr(5, 2));
                this._alpha = Number.parseInt('0x' + value.substr(7, 2));
        }

        static get WHITE() : Color {
                return new Color();
        }

        static get BLACK() : Color {
                return new Color(0, 0, 0);
        }

        static parse(value : string) : Color {
                const color : Color = Color.BLACK;
                color.string = value;
                return color;
        }
}
