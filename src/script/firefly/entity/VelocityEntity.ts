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
import {AbstractEntity} from "../../firefly/entity/AbstractEntity";
import {Vector2} from "../space/Position";
import {Container} from "../container/Container";

/**
 * Velocity Entity
 *
 * Provides an abstract entity implementation which is capable of moving based on a constant velocity value.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export abstract class VelocityEntity extends AbstractEntity {

        /**
         * Describes the entities velocity (movement per second on each axis).
         * @type {Vector2} a velocity.
         */
        public velocity : Vector2 = Vector2.ZERO;

        /**
         * {@inheritDoc}
         */
        public think(container : Container, delta : number) : void {
                this.position.offsetBy(this.velocity.clone().multiplyByFactor(delta));

                super.think(container, delta);
        }
}
