import AddPlantForm from '../../../components/Form/AddPlantForm'
import ImageUpload from '../../../ImageUpload.jsx';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth.js';
import {useState} from 'react';
import toast from 'react-hot-toast';

const AddPlant = () => {
    const { user } = useAuth()
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedImage, setUploadedImage] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(false)
    const handleFormSubmit = async e => {
        e.preventDefault()
        setIsUploading(true)
        const form = e.target
        const name = form?.name?.value
        const category = form?.category?.value
        const description = form?.description?.value
        const price = form?.price?.value
        const quantity = form?.quantity?.value
        try {
            const plantData = {
                name,
                category,
                description,
                price: parseInt(price),
                quantity: parseInt(quantity),
                image: uploadedImage,
                seller: {
                    name: user?.displayName,
                    email: user?.email,
                    image: user?.photoURL,
                },
            }

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/add-plant`,
                plantData
            )
            toast.success('Plant Data Added Successfully, Yeee!')
            form.reset()
            console.log(data)
        } catch (err) {
            console.log(err)
        } finally {
            setIsUploading(false)
        }

    }
        const handleImageUpload = async e => {
        e.preventDefault()
        const image = e.target?.files[0]
            try {
                const imageUrl = await ImageUpload(image)
                setUploadedImage(imageUrl)
            }
            catch (error) {
                setImageUploadError('errorr', error)
            }
        }
  return (
    <div>
      {/* Form */}
      <AddPlantForm handleFormSubmit={handleFormSubmit}
                    isUploading={isUploading}
                    uploadedImage={uploadedImage}
                    handleImageUpload={handleImageUpload}
                    imageUploadError={imageUploadError}
      />
    </div>
  )
}

export default AddPlant
