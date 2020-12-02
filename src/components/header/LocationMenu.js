import React from 'react'

const LocationMenu = () => {
  return (
    <div id="categoryMenu">
        <i className="fa fa-map-marker-alt"></i>
        <select name="" id="chooseLocation">
          <option value="category-rounded.php">Jakarta</option>
          <option value="category-rounded.php">Bandung</option>
          <option value="">Semarang</option>
          <option value="">Surabaya</option>
        </select>
    </div>
  )
}

export default LocationMenu
