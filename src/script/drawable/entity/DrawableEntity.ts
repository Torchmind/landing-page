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
import {Drawable} from "../Drawable";
import {Vector2} from "../Vector2";

/**
 * Drawable Entity
 *
 * Represents a drawable, moving and possibly thinking entity.
 */
export abstract class DrawableEntity implements Drawable {
        private _position : Vector2;
        private _rotation : number;
        private _health : number;
        private _lifetime : number = 0;

        public constructor(position : Vector2 = Vector2.ZERO, rotation : number = 0, health : number = -1) {
                this._position = position;
                this._rotation = rotation;
                this._health = health;
        }

        /**
         * Handles a single tick which modifies the object state.
         * @param delta a floating point which describes the relation of draw calls to realtime seconds.
         */
        public think(delta : number) : void {
                ++this._lifetime;
        }

        get position() : Vector2 {
                return this._position;
        }

        set position(value : Vector2) {
                this._position = value;
        }

        get rotation() : number {
                return this._rotation;
        }

        set rotation(value : number) {
                this._rotation = value;
        }

        get health() : number {
                return this._health;
        }

        set health(value : number) {
                this._health = value;
        }

        get lifetime() : number {
                return this._lifetime;
        }

        /**
         * Retrieves the visibility (a percentage).
         * @returns {number}
         */
        public getVisibility() : number {
                return 1.0;
        }

        /**
         * Checks whether the entity is considered "dead" and should thus be removed.
         * @returns {boolean} true if dead, false otherwise.
         */
        public isDead() : boolean {
                return this._health == 0;
        }

        /**
         * {@inheritDoc}
         */
        public abstract draw(ctx : CanvasRenderingContext2D, delta : number) : void;
}
