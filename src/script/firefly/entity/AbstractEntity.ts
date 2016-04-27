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
import {Container} from "../container/Container";
import {Entity} from "./Entity";
import {Point} from "../space/Position";

/**
 * Abstract Entity
 *
 * Provides a base implementation for all entities.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export abstract class AbstractEntity implements Entity {
        public position : Point = Point.ORIGIN;
        public rotation : number = 0;

        /**
         * {@inheritDoc}
         */
        public isDead() : boolean {
                return false;
        }

        /**
         * {@inheritDoc}
         */
        public think(container : Container, delta : number) : void {
        }

        /**
         * {@inheritDoc}
         */
        public draw(container : Container, delta : number) : void {
                container.translate(this.position.toVector());
                container.rotate(this.rotation);
        }
}
