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
import {Drawable} from "../drawable/Drawable";

/**
 * Scene
 *
 * Provides an abstraction layer for scenes which provide logic for drawing a certain screen.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export interface Scene extends Drawable {
        
        /**
         * Updates the scene state.
         *
         * @param delta a number which describes the relation between frames and realworld seconds.
         */
        think(delta : number) : void;
}
