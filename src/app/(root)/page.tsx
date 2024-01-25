"use client";
import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "@/Helpers/firebase/firebase";
import { Spin } from "antd";

export default function Home() {
  const [rooms, setRooms] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [customRoom, setCustomRoom] = useState<any>({ name: "", count: 0 });
  const [selectedRoomType, setSelectedRoomType] = useState<any>("");
  const [uploadingImages, setUploadingImages] = useState<any>(false);

  const handleRoomTypeChange = (e: any) => {
    const roomType = e.target.value;
    setSelectedRoomType(roomType);
    if (roomType !== "custom") {
      setCustomRoom({ name: "", count: 0 });
    }
  };

  const uploadBackIdCardImage = (file: any, fileType: any) => {
    // Your original upload function
  };

  const uploadRoomImages = async (roomType: any, images: any[]) => {
    if (uploadingImages) return;
    setUploadingImages(true);

    const storage = getStorage(app);
    const folder = "images/landlordImages/"; // Ensure this is the correct path
    const uploadPromises = images.map((image, index) => {
      const fileName = `${new Date().getTime()}-${roomType}-${index}`;
      const storageRef = ref(storage, folder + fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;

              default:
                break;
            }
          },
          (error) => {
            console.error(error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });

    try {
      const downloadURLs = await Promise.all(uploadPromises);

      setRooms((prevRooms: any) =>
        prevRooms.map((room: any) => {
          if (room.type === roomType) {
            return { ...room, images: downloadURLs };
          }
          return room;
        })
      );
    } catch (error) {
      console.error("Error uploading images: ", error);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleCustomRoomNameChange = (e: any) => {
    setCustomRoom({ ...customRoom, name: e.target.value });
  };

  const handleCustomRoomCountChange = (e: any) => {
    setCustomRoom({ ...customRoom, count: Number(e.target.value) });
  };

  const addRoomImages = () => {
    let count = 0;
    if (selectedRoomType === "custom") {
      count = customRoom.count;
    } else {
      const roomCountInput = document.getElementById(
        "roomCount"
      ) as HTMLInputElement;
      if (roomCountInput) {
        count = parseInt(roomCountInput.value, 10);
      }
    }

    const roomType =
      selectedRoomType === "custom" ? customRoom.name : selectedRoomType;

    if (roomType && count > 0) {
      const newRoom = {
        type: roomType,
        images: Array(count).fill(null),
      };
      setRooms((prevRooms: any) => [...prevRooms, newRoom]);
    }
  };
  const handleImageUpload = (roomType: any, index: any, event: any) => {
    const updatedRooms = rooms.map((room: any) => {
      if (room.type === roomType) {
        const updatedImages = [...room.images];
        updatedImages[index] = event.target.files[0];
        return { ...room, images: updatedImages };
      }
      return room;
    });
    setRooms(updatedRooms);
  };

  const handleSubmit = (e: any) => {
    setLoading(true);
    e.preventDefault();
    const uploadRoomImagesPromises = rooms.map((room: any) => {
      if (room.type !== "") {
        return uploadRoomImages(room.type, room.images);
      }
    });

    Promise.all(uploadRoomImagesPromises).then(() => {
      console.log(rooms);
      setLoading(false);
    });
  };

  return (
    <Spin spinning={loading} delay={500}>
      <form onSubmit={handleSubmit}>
        <select value={selectedRoomType} onChange={handleRoomTypeChange}>
          <option value="">Select a room type...</option>
          <option value="kitchen">Kitchen</option>
          <option value="bedroom">Bedroom</option>
          <option value="toilet">Toilet</option>
          <option value="custom">Custom</option>
        </select>

        {selectedRoomType && selectedRoomType !== "custom" && (
          <input id="roomCount" type="number" placeholder="Room count" />
        )}

        {selectedRoomType === "custom" && (
          <>
            <input
              type="text"
              value={customRoom.name}
              onChange={handleCustomRoomNameChange}
              placeholder="Custom room name"
            />
            <input
              type="number"
              value={customRoom.count}
              onChange={handleCustomRoomCountChange}
              placeholder="Room count"
            />
          </>
        )}

        <button type="button" onClick={addRoomImages}>
          Add Room Images
        </button>

        {rooms.map((room: any, roomIndex: any) => (
          <div key={`${room.type}-${roomIndex}`}>
            <h4>{room.type}</h4>
            {room.images.map((_: any, index: any) => (
              <input
                key={index}
                type="file"
                onChange={(e) => handleImageUpload(room.type, index, e)}
              />
            ))}
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>
    </Spin>
  );
}
