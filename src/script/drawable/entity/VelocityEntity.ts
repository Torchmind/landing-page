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
import {DrawableEntity} from "./DrawableEntity";
import {Vector2} from "../Vector2";

/**
 * Velocity Entity
 *
 * Provides a simple base entity which alters its position every tick based on a velocity value.
 */
export abstract class VelocityEntity extends DrawableEntity {
        private _velocity : Vector2;

        constructor(position : Vector2 = Vector2.ZERO, rotation : number = 0, velocity : Vector2 = Vector2.ZERO, health : number = 400) {
                super(position, rotation, health);
                this._velocity = velocity;
        }

        /**
         * {@inheritDoc}
         */
        public think(delta : number) : void {
                super.think(delta);

                this.position.offset(this._velocity.clone().multiply(delta));
        }

        get velocity() : Vector2 {
                return this._velocity;
        }

        set velocity(value : Vector2) {
                this._velocity = value;
        }
}
