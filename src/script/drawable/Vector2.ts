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
 * 2D Vector
 *
 * Represents a position in 2D space.
 */
export class Vector2 {

        private _x : number;
        private _y : number;

        public constructor(x : number = 0, y : number = 0) {
                this._x = x;
                this._y = y;
        }

        /**
         * Converts a common angle (in degrees) into radians.
         * @param angle an angle in degrees.
         * @returns {number} an angle in radians.
         */
        static toRadians(angle : number) : number {
                return angle * (Math.PI / 180);
        }

        /**
         * Creates a copy of this vector.
         * @returns {Vector2} a copy.
         */
        public clone() : Vector2 {
                return new Vector2(this._x, this._y);
        }

        /**
         * Offsets this vector by a specific amount (adds to it).
         * @param amount an amount.
         * @returns {Vector2} a reference to this vector.
         */
        public offset(amount : Vector2) : Vector2 {
                this._x += amount.x;
                this._y += amount.y;

                return this;
        }

        /**
         * Rotates this vector by the specified angle.
         * @param angle an angle (in degrees).
         * @returns {Vector2} a reference to this vector.
         */
        public rotate(angle : number) : Vector2 {
                angle = Vector2.toRadians(angle);

                const px : number = this._x * Math.cos(angle) - this._y * Math.sin(angle);
                const py : number = this._x * Math.sin(angle) + this._y * Math.cos(angle);

                this._x = px;
                this._y = py;

                return this;
        }

        /**
         * Multiplies this vector with a factor.
         * @param factor a factor.
         * @returns {Vector2} a reference to this vector.
         */
        public multiply(factor : number) : Vector2 {
                console.log(factor);

                this._x *= factor;
                this._y *= factor;

                return this;
        }

        /**
         * Multiplies this vector with another vector.
         * @param factor a factor.
         * @returns {Vector2} a reference to this vector.
         */
        public multiplyVector(factor : Vector2) : Vector2 {
                this._x *= factor.x;
                this._y *= factor.y;

                return this;
        }

        get x() : number {
                return this._x;
        }

        set x(value : number) {
                this._x = value;
        }

        get y() : number {
                return this._y;
        }

        set y(value : number) {
                this._y = value;
        }

        /**
         * Retrieves a zero vector (coordinates 0, 0).
         * @returns {Vector2} a vector.
         * @constructor
         */
        public static get ZERO() : Vector2 {
                return new Vector2();
        }

        /**
         * Retrieves a random vector (x and y ranging between 0 and 1).
         * @returns {Vector2} a vector.
         * @constructor
         */
        public static get RANDOM() : Vector2 {
                return new Vector2(Math.random(), Math.random());
        }
}
