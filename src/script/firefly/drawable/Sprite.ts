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
import {Dimensions} from "../space/Dimensions";
import {Point} from "../space/Position";

/**
 * Sprite
 *
 * Represents a loaded texture which is ready to be drawn on-screen at a certain location with a certain scale and
 * rotation.
 *
 * @author <a href="mailto:johannesd@torchmind.com">Johannes Donath</a>
 */
export interface Sprite {

        /**
         * Represents the (default) sprite size.
         */
        bounds : Dimensions;

        /**
         * Represents the sprite's center in respect to the standard dimensions.
         *
         * Note: The values within the returned representation are immutable.
         */
        center : Point;

        /**
         * Represents the sprite's pivot point (usually the center).
         */
        pivot : Point;

        /**
         * Draws a sprite at a specified location.
         * 
         * @param scale a scale.
         */
        draw(scale? : number) : void;
}
