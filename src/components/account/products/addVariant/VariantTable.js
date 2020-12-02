import React, { useContext } from "react";
import imageCompression from "browser-image-compression";

import alertContext from "../../../../context/alert/alertContext";
const VariantTable = ({
  productCombinations = [],
  handleProductCombinationChange,
}) => {
  const { setAlert } = useContext(alertContext);

  const onImageChange = async (label, key, imageFile) => {
    if (!imageFile) return;
    if (!imageFile.type.startsWith("image")) {
      setAlert(`File harus dalam format gambar/image`, "danger");
    } else {
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 600,
        useWebWorker: true,
        onProgress: () => null,
      };
      try {
        //compress file
        const compressedBlob = await imageCompression(imageFile, options);

        const compressedFile = new File([compressedBlob], imageFile.name, {
          lastModified: compressedBlob.lastModified,
          type: "image/jpeg",
        });

        handleProductCombinationChange(label, key, compressedFile);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="col-md-12">
      <table className="table table-striped noMoreTable">
        <thead>
          <tr>
            <th>Varian</th>
            <th>Harga jual marketplace</th>
            <th>Harga pasaran</th>
            <th>Stok</th>
            <th>Berat (gram)</th>
            <th>Sku (kode stok)</th>
            <th>Foto</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productCombinations.map((pc) => {
            return (
              <tr key={`${pc.variantDetail1_id}${pc.variantDetail2_id}`}>
                <td>{pc.label}</td>
                <td>
                  <input
                    type="number"
                    value={pc.marketplacePrice}
                    onChange={(e) =>
                      handleProductCombinationChange(
                        pc.label,
                        "marketplacePrice",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={pc.marketPrice}
                    onChange={(e) =>
                      handleProductCombinationChange(
                        pc.label,
                        "marketPrice",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={pc.stock}
                    onChange={(e) =>
                      handleProductCombinationChange(
                        pc.label,
                        "stock",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={pc.weight}
                    onChange={(e) =>
                      handleProductCombinationChange(
                        pc.label,
                        "weight",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={pc.sku}
                    onChange={(e) =>
                      handleProductCombinationChange(
                        pc.label,
                        "sku",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="file"
                    onChange={(e) =>
                      onImageChange(pc.label, "image", e.target.files[0])
                    }
                  />
                </td>
                <td>
                  {pc.image && (
                    <img
                      style={{ height: "50px" }}
                      src={URL.createObjectURL(pc.image)}
                      alt=""
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VariantTable;
