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
import {Cloneable} from "../utility/Cloneable";

/**
 * Point
 *
 * Represents a set of coordinates which describe a certain location in two dimensional space.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class Point implements Cloneable {
        protected _x : number;
        protected _y : number;
        protected _listener : (x : number, y : number) => boolean;

        public constructor(x : number, y : number, listener : (x : number, y : number) => boolean = null) {
                this._x = x;
                this._y = y;
                this._listener = listener;
        }

        /**
         * {@inheritDoc}
         */
        public clone() : Point {
                return new Point(this._x, this._y);
        }

        /**
         * Checks whether the supplied point is equal to this point.
         *
         * @param that the point to compare to.
         * @returns {boolean} true if equal, false otherwise.
         */
        public equals(that : Point) : boolean {
                if (that == null || that == undefined) {
                        return false;
                }

                return that == this || (this._x == that.x && this._y == that.y);
        }

        /**
         * Creates an immutable copy of this point.
         *
         * @returns {Point} an immutable point.
         */
        public immutable() : Point {
                return new Point(this._x, this._y, (x, y) => {
                        return false;
                });
        }

        /**
         * Offsets this points coordinates by the amount and direction represented by the supplied vector.
         *
         * This method returns a reference to its parent instance and is thus chain-able.
         *
         * @param vector a vector to offset by.
         * @returns {Point} a reference to this point.
         */
        public offsetBy(vector : Vector2) : Point {
                return this.update(new Point((this._x + vector.x), (this._y + vector.y)));
        }

        /**
         * Converts a point into a vector which is relative to the virtual space origin.
         *
         * @returns {Vector2} a vector.
         */
        public toVector() : Vector2 {
                return new Vector2(this._x, this._y);
        }

        /**
         *
         * Updates this point's coordinates using the coordinates supplied by the passed point.
         *
         * Note: Passing a value to this setter is not guaranteed to actually alter the internal values as a listener
         * may reject the supplied value.
         *
         * This method returns a reference to its parent instance and is thus chain-able.
         *
         * @param point a reference to a point to poll the coordinates from.
         * @returns {Point} a reference to this point.
         */
        public update(point : Point) : Point {
                if (!this.equals(point) && this._listener != null) {
                        if (!this._listener(point.x, point.y)) {
                                return this;
                        }
                }

                this._x = point.x;
                this._y = point.y;

                return this;
        }

        /* Getters & Setters */

        /**
         * Retrieves this point's X-Coordinate.
         *
         * @returns {number} an X-Coordinate.
         */
        get x() : number {
                return this._x;
        }

        /**
         * Sets this point's X-Coordinate.
         *
         * Note: Passing a value to this setter is not guaranteed to actually alter the internal value as a listener may
         * reject the supplied value.
         *
         * @param value a new X-Coordinate.
         */
        set x(value : number) {
                if (this._x != value && this._listener != null) {
                        if (!this._listener(value, this._y)) {
                                return;
                        }
                }

                this._x = value;
        }

        /**
         * Retrieves the point's Y-Coordinate.
         *
         * @returns {number} a Y-Coordinate.
         */
        get y() : number {
                return this._y;
        }

        /**
         * Sets this point's Y-Coordinate.
         *
         * Note: Passing a value to this setter is not guaranteed to actually alter the internal value as a listener may
         * reject the supplied value.
         *
         * @param value a new Y-Coordinate.
         */
        set y(value : number) {
                if (this._y != value && this._listener != null) {
                        if (!this._listener(this._x, value)) {
                                return;
                        }
                }

                this._y = value;
        }

        /* Constants */

        /**
         * Retrieves the exact location of the coordinate system origin.
         *
         * @returns {Point}
         * @constructor
         */
        static get ORIGIN() {
                return new Point(0, 0);
        }
}

/**
 * 2D Vector
 *
 * Represents a Vector of direction within 2D space in the sense of a mathematical euclidean vector of certain length.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 * @see Point for a representation of coordinates within 2D space.
 */
export class Vector2 extends Point {

        public constructor(x : number, y : number, listener : (x : number, y : number) => boolean = null) {
                super(x, y, listener);
        }

        /**
         * {@inheritDoc}
         */
        public clone() : Vector2 {
                return new Vector2(this._x, this._y);
        }

        /**
         * Calculates the dot product of this vector and the passed vector.
         *
         * @param vector a vector.
         * @returns {number} a dot product.
         */
        public dot(vector : Vector2) : number {
                return ((this._x * vector.x) + (this._y * vector.y));
        }

        /**
         * Creates an immutable copy of this vector.
         *
         * @returns {Vector2} an immutable vector.
         */
        public immutable() : Vector2 {
                return new Vector2(this._x, this._y, (x, y) => {
                        return false;
                });
        }

        /**
         * Multiplies this vector's coordinates with the supplied factor.
         *
         * This method returns a reference to its parent instance and is thus chain-able.
         *
         * @param factor a factor.
         * @returns {Vector2} a reference to this vector.
         */
        public multiplyByFactor(factor : number) : Vector2 {
                return this.update(new Vector2((this._x * factor), (this._y * factor)));
        }

        /**
         * Multiplies this vector's coordinate with the factors stored within the supplied vector.
         *
         * This method returns a reference to its parent instance and is thus chain-able.
         *
         * @param vector a vector containing a set of factors.
         * @returns {Vector2} a reference to this vector.
         */
        public multiplyBy(vector : Vector2) : Vector2 {
                return this.update(new Vector2((this._x * vector.x), (this._y * vector.y)));
        }

        /**
         * {@inheritDoc}
         */
        public offsetBy(vector : Vector2) : Vector2 {
                super.offsetBy(vector);
                return this;
        }

        /**
         * Rotates the vector around its origin (0,0).
         *
         * This method returns a reference to its parent instance and is thus chain-able.
         *
         * @param angle an angle.
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
         * Converts an angle in degrees into radians.
         *
         * @param angle an angle in degrees.
         * @returns {number} an angle in radians.
         */
        public static toRadians(angle : number) : number {
                return angle * (Math.PI / 180);
        }

        /**
         * Converts an angle in radians into degrees.
         *
         * @param radians an angle in radians.
         * @returns {number} an angle in degrees.
         */
        public static toAngle(radians : number) : number {
                return radians * (180 / Math.PI);
        }

        /**
         * {@inheritDoc}
         */
        public update(point : Point) : Vector2 {
                super.update(point);
                return this;
        }

        /* Getters & Setters */

        /**
         * Retrieves the overall length of this vector.
         *
         * @returns {number}
         */
        get length() : number {
                return Math.sqrt((Math.pow(this._x, 2) + Math.pow(this._y, 2)));
        }

        /**
         * Retrieves a copy of this vector which has been normalized to a single unit within 2D space.
         *
         * @returns {Vector2} a normalized vector.
         */
        get normalized() : Vector2 {
                const length : number = this.length;
                return new Vector2((this._x / length), (this._y / length));
        }

        /* Constants */

        /**
         * Retrieves a normalized vector which points directly down.
         *
         * @returns {Vector2}
         * @constructor
         */
        static get DOWN() {
                return new Vector2(0, -1);
        }

        /**
         * Retrieves a normalized vector which points directly left.
         *
         * @returns {Vector2}
         * @constructor
         */
        static get LEFT() : Vector2 {
                return new Vector2(-1, 0);
        }

        /**
         * Retrieves a randomized vector.
         *
         * @returns {Vector2}
         * @constructor
         */
        static get RANDOM() : Vector2 {
                return new Vector2(Math.random(), Math.random());
        }

        /**
         * Retrieves a normalized vector which points directly right.
         *
         * @returns {Vector2}
         * @constructor
         */
        static get RIGHT() : Vector2 {
                return new Vector2(1, 0);
        }

        /**
         * Retrieves a normalized vector which points directly up.
         *
         * @returns {Vector2}
         * @constructor
         */
        static get UP() {
                return new Vector2(0, 1);
        }

        /**
         * Retrieves a zero vector which has both of its coordinates set to zero.
         *
         * @returns {Vector2}
         * @constructor
         */
        static get ZERO() : Vector2 {
                return new Vector2(0, 0);
        }
}
