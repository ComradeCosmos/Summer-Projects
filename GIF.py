import imageio.v3 as iio

filenames = [] #Name images
images = [ ]

for filename in filenames:
  images.append(iio.imread(filename))

iio.imwrite('team.gif', images, duration =0.5, loop = 0)