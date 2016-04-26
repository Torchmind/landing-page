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

import {Cloneable} from "./Cloneable";
/**
 * Drawable
 *
 * Provides an abstraction layer to support automatic rendering within queues.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class Color implements Cloneable {
        private _red : number;
        private _green : number;
        private _blue : number;
        private _alpha : number;
        private _listener : (red : number, green : number, blue : number, alpha : number) => boolean;

        public constructor(red : number, green : number, blue : number, alpha : number = 255, listener : (red : number, green : number, blue : number, alpha : number) => boolean = null) {
                this._red = red;
                this._green = green;
                this._blue = blue;
                this._alpha = alpha;
                this._listener = listener;
        }

        /**
         * {@inheritDoc}
         */
        public clone() : Color {
                return new Color(this._red, this._green, this._blue, this._alpha);
        }

        /**
         * Checks whether this color is equal to the passed color.
         *
         * @param that a color to compare to.
         * @returns {boolean} true if equal, false otherwise.
         */
        public equals(that : Color) : boolean {
                return this._red == that.red && this._green == that.green && this._blue == that.blue && this._alpha == that.alpha;
        }

        /**
         * Creates an immutable copy of this color.
         *
         * @returns {Color} an immutable copy.
         */
        public immutable() : Color {
                return new Color(this._red, this._green, this._blue, this._alpha, (red, green, blue, alpha) => {
                        return false;
                });
        }

        /**
         * Updates this color's state using the values contained within the supplied color.
         *
         * This method returns a reference to its parent instance and is thus chain-able.
         *
         * @param color a color to copy all values from.
         * @returns {Color} a reference to this color.
         */
        public update(color: Color) : Color {
                if (!this.equals(color) && this._listener != null) {
                        if (!this._listener(color.red, color.green, color.blue, color.alpha)) {
                                return this;
                        }
                }

                this._red = color.red;
                this._green = color.green;
                this._blue = color.blue;
                this._alpha = color.alpha;

                return this;
        }

        /* === Getters & Setters === */

        /**
         * Retrieves the current color's red component.
         *
         * @returns {number} a component value ranging from 0 to 255.
         */
        get red() : number {
                return this._red;
        }

        /**
         * Sets the current color's red component.
         *
         * Note: Passing a value to this setter is not guaranteed to actually alter the internal value as a listener may
         * reject the supplied value.
         *
         * @param value a component value ranging from 0 to 255.
         */
        set red(value : number) {
                if (this._red != value && this._listener != null) {
                        if (!this._listener(value, this._green, this._blue, this._alpha)) {
                                return;
                        }
                }

                this._red = value;
        }

        /**
         * Retrieves the current color's green component.
         *
         * @returns {number} a component value ranging from 0 to 255.
         */
        get green() : number {
                return this._green;
        }

        /**
         * Sets the current color's green component.
         *
         * Note: Passing a value to this setter is not guaranteed to actually alter the internal value as a listener may
         * reject the supplied value.
         *
         * @param value a component value ranging from 0 to 255.
         */
        set green(value : number) {
                if (this._green != value && this._listener != null) {
                        if (!this._listener(this._red, value, this._blue, this._alpha)) {
                                return;
                        }
                }

                this._green = value;
        }

        /**
         * Retrieves the current color's blue component.
         *
         * @returns {number} a component value ranging from 0 to 255.
         */
        get blue() : number {
                return this._blue;
        }

        /**
         * Sets the current color's blue component.
         *
         * Note: Passing a value to this setter is not guaranteed to actually alter the internal value as a listener may
         * reject the supplied value.
         *
         * @param value a component value ranging from 0 to 255.
         */
        set blue(value : number) {
                if (this._blue != value && this._listener != null) {
                        if (!this._listener(this._red, this._green, value, this._alpha)) {
                                return;
                        }
                }

                this._blue = value;
        }

        /**
         * Retrieves the current color's alpha component.
         *
         * @returns {number} a component value ranging from 0 to 255.
         */
        get alpha() : number {
                return this._alpha;
        }

        /**
         * Sets the current color's alpha component.
         *
         * Note: Passing a value to this setter is not guaranteed to actually alter the internal value as a listener may
         * reject the supplied value.
         *
         * @param value a component value ranging from 0 to 255.
         */
        set alpha(value : number) {
                if (this._alpha != value && this._listener != null) {
                        if (!this._listener(this._red, this._green, this._blue, value)) {
                                return;
                        }
                }

                this._alpha = value;
        }

        /**
         * Retrieves the current color in its HEX representation (RGBA value) where the A component is omitted when no
         * transparency is present.
         *
         * @returns {string} a hex color string.
         */
        get hex() : string {
                return '#' + ('00' + this._red.toString(16)).slice(-2) + ('00' + this._green.toString(16)).slice(-2) + ('00' + this._blue.toString(16)).slice(-2) + (this.alpha != 255 ? ('00' + this._alpha.toString(16)).slice(-2) : '');
        }

        /**
         * Sets the current color using its hex representation.
         * @param value
         */
        set hex(value : string) {
                const updated : Color = this.clone();

                // the hash which is usually prepended to hex formatted colors is entirely optional here and is thus
                // stripped away before attempting to process the string further.
                if (value.charAt(0) == '#') {
                        value = value.substr(1);
                }

                updated._red = Number.parseInt(value.substr(0, 2), 16);
                updated._green = Number.parseInt(value.substr(2, 2), 16);
                updated._blue = Number.parseInt(value.substr(4, 2), 16);

                if (value.length == 8) {
                        updated._alpha = Number.parseInt(value.substr(6, 2), 16);
                } else {
                        updated._alpha = 255;
                }

                this.update(updated);
        }

        /**
         * Retrieves the current color in its CSS RGB(A) function representation.
         *
         * @returns {string} an rgb(a) function string.
         */
        get rgb() : string {
                return (this._alpha == 255 ? 'rgb' : 'rgba') + '(' + this._red + ', ' + this._green + ', ' + this._blue + (this._alpha != 255 ? ', ' + this._alpha : '') + ')';
        }
}
