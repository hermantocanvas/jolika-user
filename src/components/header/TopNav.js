import React from "react";
import { Link } from "react-router-dom";

const TopNav = () => {
  return (
    <div className="container" id="containerBottom">
            <div id="bottom-nav">
               <ul>
                  <li>
                     <Link to="#">Cakes</Link>
                     <ul className="topMegaMenu">
                        <div>
                           <h3>Category 1</h3>
                           <ul className="middleLevelMegaMenu">
                              <li>
                                 <Link to="category-rounded.php">Type</Link>
                                 <ul className="bottomLevelMegaMenu">
                                    <li><Link to="category-rounded.php">Whole Cake</Link></li>
                                    <li><Link to="category-rounded.php">Loaf Cake</Link></li>
                                    <li><Link to="category-rounded.php">Brownies</Link></li>
                                 </ul>
                              </li>
                              <li>
                                 <Link to="category-rounded.php">Event</Link>
                                 <ul className="bottomLevelMegaMenu">
                                    <li><Link to="category-rounded.php">Sweet 17</Link></li>
                                    <li><Link to="category-rounded.php">Wedding</Link></li>
                                    <li><Link to="category-rounded.php">Birthday</Link></li>
                                 </ul>
                              </li>
                           </ul>
                        </div>
                        <div>
                           <h3>Category 2</h3>
                           <ul>
                              <li><Link to="category-rounded.php">Category 1</Link></li>
                              <li><Link to="category-rounded.php">Category 2</Link></li>
                              <li><Link to="category-rounded.php">Category 3</Link></li>
                              <li><Link to="category-rounded.php">Category 4</Link></li>
                              <li><Link to="category-rounded.php">Category 5</Link></li>
                           </ul>
                        </div>
                        <div>
                           <h3>Category 3</h3>
                           <ul>
                              <li><Link to="category-rounded.php">Category 1</Link></li>
                              <li><Link to="category-rounded.php">Category 2</Link></li>
                              <li><Link to="category-rounded.php">Category 3</Link></li>
                              <li><Link to="category-rounded.php">Category 4</Link></li>
                              <li><Link to="category-rounded.php">Category 5</Link></li>
                           </ul>
                        </div>
                        <div>
                           <h3>Category 4</h3>
                           <ul>
                              <li><Link to="category-rounded.php">Category 1</Link></li>
                              <li><Link to="category-rounded.php">Category 2</Link></li>
                              <li><Link to="category-rounded.php">Category 3</Link></li>
                              <li><Link to="category-rounded.php">Category 4</Link></li>
                              <li><Link to="category-rounded.php">Category 5</Link></li>
                           </ul>
                        </div>
                     </ul>
                  </li>

                  <li>
                     <Link to="category-rounded.php">Sweets & Baked Treats</Link>
                     <ul className="topMegaMenu">
                        <div>
                           <h3>Sub Category 1</h3>
                           <ul className="middleLevelMegaMenu">
                              <li>
                                 <Link to="category-rounded.php">Type</Link>
                                 <ul className="bottomLevelMegaMenu">
                                    <li><Link to="category-rounded.php">Whole Cake</Link></li>
                                    <li><Link to="category-rounded.php">Loaf Cake</Link></li>
                                    <li><Link to="category-rounded.php">Brownies</Link></li>
                                 </ul>
                              </li>
                              <li>
                                 <Link to="category-rounded.php">Event</Link>
                                 <ul className="bottomLevelMegaMenu">
                                    <li><Link to="category-rounded.php">Sweet 17</Link></li>
                                    <li><Link to="category-rounded.php">Wedding</Link></li>
                                    <li><Link to="category-rounded.php">Birthday</Link></li>
                                 </ul>
                              </li>
                           </ul>
                        </div>
                        <div>
                           <h3>Sub Category 2</h3>
                           <ul>
                              <li><Link to="category-rounded.php">Sweets & Baked Category 1</Link></li>
                              <li><Link to="category-rounded.php">Sweets & Baked Category 2</Link></li>
                              <li><Link to="category-rounded.php">Sweets & Baked Category 3</Link></li>
                              <li><Link to="category-rounded.phpp">Sweets & Baked Category 4</Link></li>
                              <li><Link to="category-rounded.php">Sweets & Baked Category 5</Link></li>
                           </ul>
                        </div>
                        <div>
                           <h3>Sub Category 3</h3>
                           <ul>
                              <li><Link to="category-rounded.php">Sweets & Baked Category 1</Link></li>
                              <li><Link to="category-rounded.php">Sweets & Baked Category 2</Link></li>
                              <li><Link to="category-rounded.php">Sweets & Baked Category 3</Link></li>
                              <li><Link to="category-rounded.php">Sweets & Baked Category 4</Link></li>
                              <li><Link to="category-rounded.php">Sweets & Baked Category 5</Link></li>
                           </ul>
                        </div>
                     </ul>
                  </li>
                  <li><Link to="category-rounded.php">Flowers</Link>
                    <ul className="topMegaMenu">
                        <div>
                           <h3>Sub Category 1</h3>
                           <ul className="middleLevelMegaMenu">
                              <li>
                                 <Link to="category-rounded.php">Type</Link>
                                 <ul className="bottomLevelMegaMenu">
                                    <li><Link to="category-rounded.php">Whole Cake</Link></li>
                                    <li><Link to="category-rounded.php">Loaf Cake</Link></li>
                                    <li><Link to="category-rounded.php">Brownies</Link></li>
                                 </ul>
                              </li>
                              <li>
                                 <Link to="category-rounded.php">Event</Link>
                                 <ul className="bottomLevelMegaMenu">
                                    <li><Link to="category-rounded.phpp">Sweet 17</Link></li>
                                    <li><Link to="category-rounded.php">Wedding</Link></li>
                                    <li><Link to="category-rounded.php">Birthday</Link></li>
                                 </ul>
                              </li>
                           </ul>
                        </div>
                        <div>
                           <h3>Sub Category 2</h3>
                           <ul>
                              <li><Link to="category-rounded.php">Flowers Category 1</Link></li>
                              <li><Link to="category-rounded.php">Flowers Category 2</Link></li>
                              <li><Link to="category-rounded.php">Flowers Category 3</Link></li>
                              <li><Link to="category-rounded.php">Flowers Category 4</Link></li>
                              <li><Link to="category-rounded.php">Flowers Category 5</Link></li>
                           </ul>
                        </div>
                        <div>
                           <h3>Sub Category 3</h3>
                           <ul>
                              <li><Link to="category-rounded.php">Flowers Category 1</Link></li>
                              <li><Link to="category-rounded.php">Flowers Category 2</Link></li>
                              <li><Link to="category-rounded.php">Flowers Category 3</Link></li>
                              <li><Link to="category-rounded.php">Flowers Category 4</Link></li>
                              <li><Link to="category-rounded.php">Flowers Category 5</Link></li>
                           </ul>
                        </div>
                     </ul>
                  </li>
                <li>
                   <Link to="category-rounded.php">Gifts & Hampers</Link>
                   <ul className="topMegaMenu">
                      <div>
                         <h3>Hampers Sub 1</h3>
                         <ul className="middleLevelMegaMenu">
                            <li>
                               <Link to="category-rounded.php">Type</Link>
                               <ul className="bottomLevelMegaMenu">
                                  <li><Link to="category-rounded.php">Whole Cake</Link></li>
                                  <li><Link to="category-rounded.php">Loaf Cake</Link></li>
                                  <li><Link to="category-rounded.php">Brownies</Link></li>
                               </ul>
                            </li>
                            <li>
                               <Link to="category-rounded.php">Event</Link>
                               <ul className="bottomLevelMegaMenu">
                                  <li><Link to="category-rounded.php">Sweet 17</Link></li>
                                  <li><Link to="category-rounded.php">Wedding</Link></li>
                                  <li><Link to="category-rounded.php">Birthday</Link></li>
                               </ul>
                            </li>
                         </ul>
                      </div>
                      <div>
                         <h3>Hampers Sub 2</h3>
                         <ul>
                            <li><Link to="category-rounded.php">Hampers Category 1</Link></li>
                            <li><Link to="category-rounded.php">Hampers Category 2</Link></li>
                            <li><Link to="category-rounded.php">Hampers Category 3</Link></li>
                            <li><Link to="category-rounded.php">Hampers Category 4</Link></li>
                            <li><Link to="category-rounded.php">Hampers Category 5</Link></li>
                         </ul>
                      </div>
                      <div>
                         <h3>Hampers Sub 3</h3>
                         <ul>
                            <li><Link to="category-rounded.php">Hampers Category 1</Link></li>
                            <li><Link to="category-rounded.php">Hampers Category 2</Link></li>
                            <li><Link to="category-rounded.php">Hampers Category 3</Link></li>
                            <li><Link to="category-rounded.php">Hampers Category 4</Link></li>
                            <li><Link to="category-rounded.php">Hampers Category 5</Link></li>
                         </ul>
                      </div>
                   </ul>
                </li>
            <li>
               <Link to="category-rounded.php">Balloons</Link>
               <ul className="topMegaMenu">
                  <div>
                     <h3>Ballons Sub 1</h3>
                     <ul className="middleLevelMegaMenu">
                        <li>
                           <Link to="category-rounded.php">Type</Link>
                           <ul className="bottomLevelMegaMenu">
                              <li><Link to="category-rounded.php">Whole Cake</Link></li>
                              <li><Link to="category-rounded.php">Loaf Cake</Link></li>
                              <li><Link to="category-rounded.php">Brownies</Link></li>
                           </ul>
                        </li>
                        <li>
                           <Link to="category-rounded.php">Event</Link>
                           <ul className="bottomLevelMegaMenu">
                              <li><Link to="category-rounded.phpp">Sweet 17</Link></li>
                              <li><Link to="category-rounded.php">Wedding</Link></li>
                              <li><Link to="category-rounded.php">Birthday</Link></li>
                           </ul>
                        </li>
                     </ul>
                  </div>
                  <div>
                     <h3>Ballons Sub 2</h3>
                     <ul>
                        <li><Link to="category-rounded.php">Ballons Category 1</Link></li>
                        <li><Link to="category-rounded.php">Ballons Category 2</Link></li>
                        <li><Link to="category-rounded.php">Ballons Category 3</Link></li>
                        <li><Link to="category-rounded.php">Ballons Category 4</Link></li>
                        <li><Link to="category-rounded.php">Ballons Category 5</Link></li>
                     </ul>
                  </div>
                  <div>
                     <h3>Ballons Sub 3</h3>
                     <ul>
                        <li><Link to="category-rounded.php">Ballons Category 1</Link></li>
                        <li><Link to="category-rounded.php">Ballons Category 2</Link></li>
                        <li><Link to="category-rounded.php">Ballons Category 3</Link></li>
                        <li><Link to="category-rounded.php">Ballons Category 4</Link></li>
                        <li><Link to="category-rounded.php">Ballons Category 5</Link></li>
                     </ul>
                  </div>
               </ul>
            </li>
            </ul>
         </div>
         </div>
  );
};

export default TopNav;
