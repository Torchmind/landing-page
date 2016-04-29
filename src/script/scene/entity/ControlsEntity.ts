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
import {Sprite} from "../../firefly/drawable/Sprite";
import {VelocityEntity} from "../../firefly/entity/VelocityEntity";
import {Container} from "../../firefly/container/Container";
import {AbstractEntity} from "../../firefly/entity/AbstractEntity";

/**
 * Controls Entity
 *
 * Provides a simple guide on how to play the game.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export class ControlsEntity extends AbstractEntity {
        private _lifetime : number = 0;
        private _sprite : Sprite;

        public constructor(sprite : Sprite) {
                super();

                this._sprite = sprite;
        }

        /**
         * {@inheritDoc}
         */
        public isDead() : boolean {
                return this._lifetime >= 10.0;
        }

        /**
         * {@inheritDoc}
         */
        public think(container : Container, delta : number) : void {
                super.think(container, delta);
                this._lifetime += delta;
        }

        /**
         * {@inheritDoc}
         */
        public draw(container : Container, delta : number) : void {
                super.draw(container, delta);

                if (this._lifetime >= 5.0) {
                        container.fillColor.alpha *= (1.0 - (Math.max(0, (this._lifetime - 5)) / 5.0));
                }

                this._sprite.draw(0.1);
        }
}
