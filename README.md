You first need to get a MNIST Keyras already trained model.

One is provided in file called cnn.h5. Many others are available using Google...

Convert this file to be readable with Tensorflow using something like (https://github.com/tensorflow/tfjs-converter):
tensorflowjs_converter --input_format keras keyras_model.h5 target_directory

The result of this command is in assets directory.

Refer to https://js.tensorflow.org for detailled explanantions.

Then you can load it in Tensorflow using:
this.model = await tf.loadModel('./assets/model.json');