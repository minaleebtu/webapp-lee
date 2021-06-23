# Assignment 7
# Table of Contents
* [Description and Activities](#description-and-activities)
* [Purpose and Title](#purpose-and-title)
* [List of information management tasks](#list-of-information-management-tasks)

## Description and Activities

### Description 
&nbsp;This music club was formed to promote taste and talent amongst Brandenburg Technology University (BTU) students by organizing regular performances and going to the concert by professionals. This club is for amateur players who are currently studying in BTU. It is a great opportunity to come together and discuss music for students who are interested in playing musical instruments or classical music. 

&nbsp;Meetings are usually held once a week for each ensemble and once a month for the entire ensembles. Apart from these meetings, other meetings are scheduled based on the individual needs of students. Also, workshops are sometimes preceded depending on the schedules of the members to promote relationship between colleagues.

### Activities
- Practice playing musical instruments which you want to play
- Periodic performances twice in a year
- Going to the concerts together to feel professional playing and get motivated
- Workshops for promoting the relationship between colleagues 
- Meetings for each ensemble or whole ensembles

## Purpose and Title
### Purpose
&nbsp;To promote students to enjoy music by playing musical instruments with having regular performances and by going to a concert by experienced musicians. Moreover, students in the music club can develop musical skills by playing the musical instruments and preparing for the performances as well as the organizational skills through creating groups and managing the concerts together with other students. The biggest purpose of this club is to enhance the enjoyment for music to the students.

### Title
BTU Music Club (**Domain name**: btu-musicclub)

## List of information management tasks
+ Create the data of a new member of the club
  + Title: Create a new Member
  + Description: Creating a record of a new member such as a name of the member, the musical instrument which the member plays, an email address, a role (for example, a president, a manager, a leader of each ensemble etc).
 
+ Update the data of a member of the club
  + Title: Update a Member
  + Description: Making modification of the data of an exsisting member.
  
+ Delete the data of a member of the club
  + Title: Delete a Member
  + Description: Deleting the data of the member who leaves the club.

+ List all announcements of concerts, meetings, workshops
  + Title: List of Announcements
  + Description: Showing a list of information about concerts, meetings, and workshops. The concert's information could be a name of the concert, the date and time when the concert holds, a location where the concert is held, the short information about the concert. The information of meetings could be what the meeting is about, the date and time when the meeting is held, a person who manages the meeting. The workshop's information could be a title of the workshop, the start and end date of the workshop, a location of the workshop, a person who manages the workshop.

+ Create an announcement of concerts, meetings, workshops
  + Title: Create an Announcement
  + Description: Creating a new announcement of one of the concert, the meeting, and the workshop. The selection can be performed with the help of a category.

+ Update an announcement of concerts, meetings, workshops
  + Title: Update an Announcement
  + Description: Modifiying the content of an existing announcement.

+ List all ensembles' information
  + Title: List Ensembles
  + Description: Showing the data of each ensemble such as information about the ensemble, the members who are in the ensemble, a location for practice, the practice date and time. Types of ensembles would be wind band, flute choir, saxophone ensemble, string ensemble, etc.

+ Create the data of the ensemble
  + Title: Create an Ensemble
  + Description: Creating a new ensemble's data.

+ Update the data of the ensemble
  + Title: Update an Ensemble
  + Description: Updating an exsisting ensemble's data.

+ Delete the data of the ensemble
  + Title: Delete an Ensemble
  + Description: Deleting the data of the ensemble if it is not active anymore.

|requirements of client                                   |requirements elaborated  |
|:------------------------------:|:-------------------:|
|member related | |
|Create a new Member  | creating a new club member record with name, instrument, mail address, role in {president, manager, ensemble leader} |
|Update a Member  | modifying the data of an existing member  |
|Delete a Member  | delete the data of a member of the club  |
|event related    | |
|List of Events  | listing all events of event in {concert, meeting, workshop} with related information <ul><li>concert {title, date, location, description, acts, person in charge}</li> <li>meeting {title, date, description, person in charge}</li> <li>workshop {title, date, location, description, person in charge}</li></ul>   |
|Create an Event | creating an event with a type in {concert, meeting, workshop}  |
|Update an Event | modifying the date of an existing event  |
|ensemble related | |
|List Ensembles | listing all ensembles of type in {wind band, flute choir, saxophone ensemble, string ensemble} with related information {members, practicing location, practicing date} |
|Create an Ensemble | creating a new ensemble  |
|Update an Ensemble | modifying the date of an existing ensemble  |
|Delete an Ensemble | deleting the data of an existing ensemble  |


## Domain Model based on [issue-#2](https://github.com/minaleebtu/webapp-lee/issues/2)
![domain information model(2)](https://user-images.githubusercontent.com/74601338/123065703-b028e480-d40f-11eb-8ec2-419ca7c0f934.png)

## Design Model based on [issue-#3](https://github.com/minaleebtu/webapp-lee/issues/3)
![information design model(2)](https://user-images.githubusercontent.com/74601338/123065736-b9b24c80-d40f-11eb-89dc-13b4d2ec2417.png)

