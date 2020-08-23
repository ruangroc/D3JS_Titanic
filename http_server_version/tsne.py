# -*- coding: utf-8 -*-
"""
Created on Thu Aug 20 13:10:33 2020
Running Titanic data through t-sne
@author: anita
"""

import json
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import preprocessing
from sklearn.preprocessing import StandardScaler
from sklearn.manifold import TSNE

# load the dataset
df = pd.read_csv('titanic_test_results.csv')
df.drop(['Unnamed: 14', 'Unnamed: 15', 'Unnamed: 16'], axis=1, inplace=True)
num_rows, num_cols = df.shape

# Encode the data (transform categorical to numerical)
labelEncoder = preprocessing.LabelEncoder()

df['sex'] = labelEncoder.fit_transform(df['sex'])    
# 0 = female, 1 = male

df['class'] = labelEncoder.fit_transform(df['class'])
# 0 = 1st class, 1 = 2nd class, 2 = 3rd class

df['deck'] = labelEncoder.fit_transform(df['deck'])
# 0 = A, 1 = B, 2 = C, 3 = D, 4 = E, 5 = F, 6 = unknown

df['embark_town'] = labelEncoder.fit_transform(df['embark_town'])
# 0 = Cherbourg, 1 = Queenstown, 2 = Southampton

df['alone'] = labelEncoder.fit_transform(df['alone'])
# 0 = n, 1 = y

df['is_prediction_correct'] = labelEncoder.fit_transform(df['is_prediction_correct'])
# 0 = correct, 1 = incorrect


# standardize the dataset
data = StandardScaler().fit_transform(df)
data = pd.DataFrame(data)

# use tsne default values
tsne = TSNE(random_state=0, n_components=2)

# transform original dataset into 2d shape, will create numpy array
tsne_results = tsne.fit_transform(data)

# for visualization, turn it into a pandas df and give column names
tsne_results=pd.DataFrame(tsne_results, columns=['tsne1', 'tsne2'])

# create scatterplot where color represents the classifications
plt.scatter(tsne_results['tsne1'], tsne_results['tsne2'], c=df.is_prediction_correct)
plt.show()

# export the tsne_results df to a json file
json_result = tsne_results.to_json(orient="index")
parsed = json.loads(json_result)

# write it to a file
with open('data2.json', 'w') as outfile:
    json.dump(parsed, outfile)
