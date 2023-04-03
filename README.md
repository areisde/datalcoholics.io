# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| | |
| | |
| | |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

We will be exploring a dataset that was scraped from TripAdvisor by one of the members of our group for another project (which was also supervised by Prof. Laurent Vuillon). The data goes from January 2012 up until September 2022. The dataset consists of all restaurants in Switzerland and neighbouring regions present on TripAdvisor, as well as all reviews for these restaurants and user profiles that wrote the reviews. The dataset has already been used to create a restaurant recommender system, so it doesn’t need much more cleaning or preprocessing as that has already been done. This is what the dataset looks like :

# TODO : Image du tableau ici

### Problematic

Market analysis is an important step in the process of starting a business. It is often a lengthy process that involves the analysis of market trends, such as consumer behavior. The results of these analyses are often presented statically in graphs and charts and can be difficult to interpret without prior economic knowledge. We decided to tackle this issue in the catering sector where consumer behavior analysis is important. Indeed, knowing consumers’ food consumption behavior can help you launch a business by choosing the best location depending on the type of food for example. You can even adapt your menus according to customers' trends. 
Our visualization aims to address this issue at a local scale, i.e, in the area of Lausanne. In order to do so, we would like to expose a simplified and interactive way to interact with consumer consumption behavior data in the region using an interactive 3D map with all the restaurants of our data set. The visualization would be user-friendly and the data presented, easy to interpret independently from the economic background knowledge. Finally, our visualization is made for everyone interested in consumers’ consumption trends in the area of Lausanne.

### Exploratory Data Analysis

##### Restaurant key attributes
We first looked at how often the different attributes were present in the restaurant data and noticed that most of the time (approx. 90%) the cuisine type was mentioned, about 62% of the time there was a rating for the cuisine, the service and the quality/price. Mood was only rated 25% of the time and michelin stars were present 2% of the time. Nevertheless, we assume that if a restaurant has a michelin star it is a known fact and these 2% would therefore represent the number of restaurants with a michelin star.

# TODO : graph restos

##### User key attributes
From the user profiles, one can know their country of origin 62% of the time and the city half of the time. The age and sex are rarely mentioned which doesn’t really allow us to use it for this project.

# TODO : graph users

##### User vectors
During this analysis we have built user vectors which will allow us to explore different dimensions of the data. The vectors are built as follows : 

# TODO : add user vector image

We have taken the weighted average of each parameter over all the restaurants a user has been to by using the rating given by the user as the weight for the weighted average. The user’s top cuisines are simply a ranking of the most popular cuisines for each user amongst the restaurants the user has been to. The average michelin score is simply a weighted average of 1’s and 0’s, 1 when the restaurant has a michelin star and 0 when the restaurant has no michelin star. A similar vector was also calculated for the variance to get a sense of user tastes : the higher the variance in a parameter for the different restaurants a user has been to, the less important the parameter is. This could be leveraged to display with colours the types of profiles going to different restaurants.

For additional details regarding data, you can take a look at the milestone_1 jupyter notebook : it provides additional information along with figures summarizing overall statistics.

### Related work
As said previously, this dataset consists of TripAdvisor scraped data. TripAdvisor has been the subject of numerous studies and research, especially using machine learning and sentiment analysis : here is a great example of such. Yet, those studies focus exclusively on sentiment and often analyze restaurant reviews from all over the world. One aspect of our project is to integrate geographical information to display to users which is often overlooked by ML-focused studies.
 
Moreover, our main focus is to center our project around Switzerland and its surroundings and focus our attention on local restaurants to provide an insight of the nearby area. Another issue with TripAdvisor data studies is that they frequently focus on numerical results and basic mathematical graph visualizations: we would like to bring our results in an interactive and useful format for people to be able to experiment with our results.
 
To get an idea of what visualizations we want to create, Tableau Public is a good way to start: it references thousands of data visualizations in a variety of subjects. This website collects visuals from newspapers or institutions as well as some from blogs or personal websites.  It allows us to get ideas for our project by having concrete examples of various visualizations.
Regarding restaurant-oriented visualizations, the NYC Foodiverse by Will Su is one great example: it focuses on sanitary problems in NYC restaurants. It summarizes very complex data that can be hard to explain and represents it in a simple and elegant way.
  
On a different level, the YouTube channel from the Vox newspaper is a good model at making data visualizations and infographics simple enough for everyone to understand. They can simplify complex subjects using clear and helpful visualizations to display data, metrics, etc to make people understand the big picture.

# TODO : Add links to text

## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

