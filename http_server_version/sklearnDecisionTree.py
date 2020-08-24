# -*- coding: utf-8 -*-
"""
Created on Thu Aug  6 10:33:41 2020
Using sklearn for decision trees
@author: anita
"""

import pandas as pd
from sklearn import preprocessing
from sklearn import tree
import graphviz

# Load the dataset into a dataframe
df = pd.read_csv('titanic_test_results.csv')
df.drop(['Unnamed: 14', 'Unnamed: 15', 'Unnamed: 16'], axis=1, inplace=True)
num_rows, num_cols = df.shape


# Encode the data (transform categorical to numerical)
labelEncoder = preprocessing.LabelEncoder()

# passenger_id = df['id']
survived = df['survived']
age = df['age']
n_siblings_spouses = df['n_siblings_spouses']
parch = df['parch']
fare = df['fare']

sex = labelEncoder.fit_transform(df['sex'])    
# print("labels for sex", sex[0:5])
# 0 = female, 1 = male

social_class = labelEncoder.fit_transform(df['class'])
# print("labels for class", social_class[0:20])
# 0 = 1st class, 1 = 2nd class, 2 = 3rd class

deck = labelEncoder.fit_transform(df['deck'])
# print("labels for deck", deck[0:25])
# 0 = A, 1 = B, 2 = C, 3 = D, 4 = E, 5 = F, 6 = unknown

embark_town = labelEncoder.fit_transform(df['embark_town'])
# print("labels for embark_town", embark_town[0:15])
# 0 = Cherbourg, 1 = Queenstown, 2 = Southampton

alone = labelEncoder.fit_transform(df['alone'])
# print("labels for alone", alone[0:5])
# 0 = n, 1 = y

is_prediction_correct = labelEncoder.fit_transform(df['is_prediction_correct'])
# print("labels for is_prediction_correct", is_prediction_correct[0:5])
# 0 = correct, 1 = incorrect


# Build the features
features = []
for i in range(num_rows):
    features.append([survived[i], sex[i], age[i], 
                     n_siblings_spouses[i], parch[i], fare[i], 
                     social_class[i], deck[i], embark_town[i], alone[i]])
    
clf = tree.DecisionTreeClassifier(min_samples_split=6, max_depth=4)
clf = clf.fit(features, is_prediction_correct)

# Visualize the tree (exports to Titanic.pdf)
names = ['survived', 'sex', 'age', 'n_siblings_spouses', 'parch', 
         'fare', 'class', 'deck', 'embark_town', 'alone']
target_names = ['correct', 'incorrect']
dot_data = tree.export_graphviz(clf, out_file=None, filled=True,
                                feature_names = names,
                                class_names = target_names) 
graph = graphviz.Source(dot_data) 
graph.render("Titanic_no_id_min_samples_split_6_max_depth_4") 


# Compare with the tree I made (same features)
features = []
for i in range(num_rows):
    features.append([sex[i], age[i], social_class[i], alone[i]])
dectree = tree.DecisionTreeClassifier()
dectree = dectree.fit(features, is_prediction_correct)
dot_data = tree.export_graphviz(dectree, out_file=None, filled=True,
                                feature_names = ['sex', 'age', 'class', 'alone'],
                                class_names = target_names) 
graph = graphviz.Source(dot_data) 
graph.render("Titanic_similar_to_mine_no_id_no_max_depth") 


