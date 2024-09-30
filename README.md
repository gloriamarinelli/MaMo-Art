![alt text](https://github.com/gloriamarinelli/MaMo-Art/blob/main/client/src/images/MaMo.png)


# MaMo Art 

**Presented by:**

- Gloria Marinelli, 2054014
- Mario Morra, 2156770

The idea is a web-based application which serves as an online marketplace for the search and purchase of artworks created by a number of different artists. Potential users are afforded the opportunity to explore a variety of paintings prior to making a purchase. 
The application’s architectural framework consists of the following components:
- A **database**, managed by **MongoDB**.
- A **backend**, constructed using **Python** with the **Flask** web framework.
- A **frontend**, developed using the **ReactJS** framework.

The entire application is based on two datasets: the [Edvard Munch Paintings](https://www.kaggle.com/datasets/isaienkov/edvard-munch-paintings) dataset and the [Museum of Modern Art (MoMA) Collection](https://www.kaggle.com/datasets/momanyc/museum-collection?select=artworks.csv) dataset.

The web application is structured as follows:
- The **login** page
- the **sign up** page
- The **homepage**: displays all available paintings at MaMo Art gallery. Selecting a painting will display a summary of relevant information about the artwork, including the title, name, date, medium, dimensions, acquisition date, and other pertinent details. Furthermore, users have the option to purchase the selected artwork directly from this page, which will then be added to their list of orders.
- The **orders** page: displays all orders placed by the user, including the Order ID, the Artwork ID and the date of the order.
- The **artists** page: displays all artists associated with **MaMo Art Gallery**. Clicking on an artist displays their biography (nationality, gender, birth year, death year) and the list of their relative paintings.
