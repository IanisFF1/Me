# Image Classification using CNN (Cats vs. Dogs)

This project demonstrates the application of Convolutional Neural Networks (CNN) for binary image classification using a preprocessed dataset of dogs and cats.

## Key Features
* **Architecture Comparison**: Evaluated performance between 2-layer and 4-layer convolutional neural networks.
* **Optimization Analysis**: Comparison of `Adam` and `SGD` optimizers to observe convergence behavior.
* **Hyperparameter Tuning**: Impact assessment of different kernel sizes (3x3 vs 5x5) on classification accuracy.

## Technical Overview
The notebook includes:
* **Data Preprocessing**: Normalization and reshaping of pixel data (100x100x3).
* **Model Evaluation**: Use of `accuracy_score` and `Pandas` for performance comparison.
* **Visual Testing**: Predictions on random test images with confidence scores.

## Results
The best results were achieved using a **2-layer model** with the **Adam optimizer** and a **5x5 kernel**, reaching an accuracy of approximately **68%** on the test set.

Detailed theoretical explanations and visual results are documented directly within the Jupyter Notebook.

*Note: If you would like to test the model yourself, you would have to download a dataset from Kaggle and separate it into 2 parts for train and test purposes as follows: "input.csv" and "labels.csv" for the train section; "input_test.csv" and "labels_test.csv" for the test section. The structure is prepared for you in the **data** folder.*