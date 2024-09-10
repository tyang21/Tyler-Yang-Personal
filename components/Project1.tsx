import React from "react";
import Image from 'next/image'

export const Project1 = () => {
  return (
    <div className="sm:py-20 p-4 justify-start min-h-screen w-full">
      <h1 className="font-bold text-5xl py-4 underline">Project 1: Images of the Russian Empire - Colorizing the Prokudin-Gorskii photo collection</h1>
      <h2 className="font-bold text-3xl py-4">Tyler Yang</h2>
      <h2 className="underline text-3xl"> Overview</h2>
      <p className= 'py-3 text-justify'>
        Prokudin Gorskii was a pioneer of his time. He believed that color photography was going to take over the future. However, he knew that there was not way to print out the the color photos out at his time. Thus, he came up with the brilliant idea of taking three photos of the same scene using a red, green, and blue filter. An example of one of these photos is pictured below.
      </p>
      <Image
        src="/CS180_images/Project1_Images/cathedral.jpg"
        alt="A russian Cathedral taken by Prokudin Gorskii"
        width={150}
        height={150}
        className= "float-right p-2"
      />
      <p className='italic py-4'>
        Figure: A picture of a russian cathedral taken by Prokudin Gorskii.
      </p>
      <p>
        The goal of this project is to be able to take these sets of three photos and turn them into a color image using the technology we have today.
      </p>
      <h2 className="underline text-3xl py-4"> Solution</h2>
      <p className='text-justify'>
        To do this, I first seperate the three channels. The top photo is the blue filter, proceeded by the green filter, and finally the red filter. In order to align the channels together, I utilize a metric called Normalized Cross-Correlation (NCC) where if I turn the images into vectors, I can simply perform a dot product between the two normalized vectors to see similiarity. The higher the dot product, the more similar the images are. We utilize a circular shift to determine the offset needed to perform the correct alignment. The process to check alignment are as follows:
      </p>
      <p className='pl-4 text-justify'>
        (1) crop the channels to only use the middle 50% for NCC calculation. We will get undesired effects if we allow the black border to be included in our NCC metric (especially if it rolls over from our circular shift).
      </p>
      <p className='pl-4 text-justify' >
        (2) For an exhaustive search of an offset from (-30, -30) to (30, 30), we will circular shift and calculate NCC metrics for each offset.
      </p>
      <p className='pl-4 text-justify'>
        (3) The offset with the highest NCC metric is the offset we will use to align the channels.
      </p>
      <p className = 'text-justify font-semibold'>
        It is also worth noting that I used the red filter as a reference and set offsets for blue and green.
      </p>
      <p className= 'text-justify'>
        With larger images - this single scale exhaustive search method is not efficient. Thus, I moved to implement a course-to-fine pyramid speedup method. For this, I resize the image until the maximum dimension is less than 320 pixels. Then I called the exhaustive search function mentioned above. Afterwards, I resize the image and the calculated offset - scaling upwards by a factor of 2. At each step, I call the align function again with the new resolution and refine the offset by running an exhaustive search from the previous offset with a margin of 2.
      </p>
      <p className= 'text-justify'>
        This method was enough to get sufficient alignment results on all images but one which I will talk about in the next section. Below I will showcase all images in the dataset with an offset table below:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/cathedral.jpgredanti4x.jpg" alt="Project 1" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Cathedral: B Offset: (-7, -1), G Offset: (-12, -3)</p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/church.tifredanti4x.jpg" alt="Project 2" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Church: B Offset: (-33, 8), G Offset: (-58, 4) </p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/emir.tifredanti4x.jpg" alt="Project 3" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Emir: B Offset: (-57, -17), G Offset: (40, -13)</p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/harvesters.tifredanti4x.jpg" alt="Project 4" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Harvesters: B Offset: (-64, 3), G Offset: (-124, -14)</p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/icon.tifredanti4x.jpg" alt="Project 5" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Icon: B Offset: (-49, -5), G Offset: (-90, -23)</p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/lady.tifredanti4x.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Lady: B Offset: (-60, -4), G Offset: (-112, -12)</p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/melons.tifredanti4x.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Melons: B Offset: (-96, -3), G Offset: (-180, -13)</p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/monastery.jpgredanti4x.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Monastery: B Offset: (-6, -1), G Offset: (-3, -2)</p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/onion_church.tifredanti4x.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Onion Church: B Offset: (-57, -10), G Offset: (-108, -36)</p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/sculpture.tifredanti4x.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Sculpture: B Offset: (-107, 16), G Offset: (-140, 27)</p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/self_portrait.tifredanti4x.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Self Portrait: B Offset: (-98, -8), G Offset: (-176, -37)</p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/three_generations.tifredanti4x.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Three Generations: B Offset: (-59, 3), G Offset: (-111, -12)</p>
            </div>

            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/tobolsk.jpgredanti4x.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Tobolsk: B Offset: (-4, -1), G Offset: (-7, -3)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/train.tifredanti4x.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Train: B Offset: (-43, -26), G Offset: (-87, -32)</p>
            </div>
        </div>
        <h2 className="underline text-3xl py-4"> Bells and Whistles</h2>
        <p className='text-justify'>
            Notice that there IS indeed a photo that in the last section was not 100 percent aligned. No matter how much I modified parameters, I could not seem to get emir.tif to be aligned. The main problem with emir.tif lied in the fact that Blue was just drastically more emphasized than Red or Green causing NCC to not work as well. I decided to try a drastically different metric than NCC - SSIM (The Structural Similarity Index). Rather than using RGB, from 
            <a href='https://ece.uwaterloo.ca/~z70wang/publications/ssim.pdf' className='underline text-black-400 px-2'>
                Wang et al.,2004
            </a>
            SSIM utilizes luminance, constrast, and structure to determine similarity. An approximation is made within the paper such that we can utilize the formula:
            <Image
                src="/CS180_images/Project1_Images/ssim.png"
                alt="SSIM Formula"
                width="500"
                height="500"
                className="flex flex-center align-center"
            />
            where x and y are the two channels, mu is the sample mean, and C_1 = (k_1L)^2, C_2 = (k_2L)^2, where k_1 = 0.01, k_2 = 0.03, and L = 255. However, after implementing SSIM, I was still slightly dissapointed with the results, so I tried aligning with edges.
        </p>
        <p className='text-justify'>
            I utilized the sobel edge detection to find edges in the image. The Sobel operator takes advantage of the fact that numerically - in a gray scale image, edges are represented by fast changes in pixel intensity. Hence, we can use gradients to actually determine where edges are! At edges gradients will be larger, while at other locations, gradients will be smaller. A great explanation of this and visualization can also be found through the 
            <a href='https://docs.opencv.org/3.4/d2/d2c/tutorial_sobel_derivatives.html' className='underline text-black-400 px-2'>
                OpenCV documentation. 
            </a>
        </p>
        <p className='text-justify'>
            Thus, I turned all blue, green and red channels into sobel edge detected images. Then, I simply ran the same course-to-fine image pyramid alignment method as before on these new images. The results are astounding.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/emir.tifredanti4x.jpg" alt="Project 1" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Before Emir: B Offset: (-57, -17), G Offset: (40, -13)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/emir.tifssim.jpg" alt="Project 2" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">After Emir: B Offset: (-58, -17), G Offset: (-124, -42) </p>
            </div>
        </div>
        <p className= 'text-justify'>
            Here are all the images with SSIM + sobel edge detection alignment:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/cathedral.jpgssim.jpg" alt="Project 1" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Cathedral: B Offset: (-7, -1), G Offset: (-12, -3)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/church.tifssim.jpg" alt="Project 2" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Church: B Offset: (-33, 8), G Offset: (-58, 4) </p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/emir.tifssim.jpg" alt="Project 3" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Emir: B Offset: (-58, -17), G Offset: (-124, -42)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/harvesters.tifssim.jpg" alt="Project 4" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Harvesters: B Offset: (-64, 3), G Offset: (-123, -13)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/icon.tifssim.jpg" alt="Project 5" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Icon: B Offset: (-49, -5), G Offset: (-90, -23)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/lady.tifssim.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Lady: B Offset: (-63, -4), G Offset: (-119, -13)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/melons.tifssim.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Melons: B Offset: (-96, -3), G Offset: (-181, -12)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/monastery.jpgssim.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Monastery: B Offset: (-6, -1), G Offset: (-3, -2)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/onion_church.tifssim.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Onion Church: B Offset: (-57, -10), G Offset: (-108, -37)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/sculpture.tifssim.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Sculpture: B Offset: (-107, 16), G Offset: (-140, 27)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/self_portrait.tifssim.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Self Portrait: B Offset: (-98, -8), G Offset: (-176, -36)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/three_generations.tifssim.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Three Generations: B Offset: (-59, 4), G Offset: (-111, -10)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/tobolsk.jpgssim.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Tobolsk: B Offset: (-4, 0), G Offset: (-7, -3)</p>
            </div>
            <div className="gallery-item">
                <Image src="/CS180_images/Project1_Images/train.tifssim.jpg" alt="Project 6" width= '600' height= '400' className="w-full h-auto rounded-lg shadow-md transform hover:scale-105 transition duration-300"/>
                <p className="text-center mt-4 text-gray-600">Train: B Offset: (-43, -26), G Offset: (-86, -33)</p>
            </div>
        </div>
    </div>
  );
};
export default Project1;