

# import pickle
# import time
# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# driver = webdriver.Chrome('./chromedriver.exe')
# driver.get("http://www.instagram.com")
# time.sleep(60)
# pickle.dump(driver.get_cookies(), open("cookies.pkl", "wb"))


from ast import Break
from cgitb import enable
from re import T
import glob
from socket import timeout
from time import sleep
import urllib.request as urllib
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import pickle
from selenium import webdriver
import os
import shutil


def load_cookie(driver):
    with open('cookies.pkl', 'rb') as cookiesfile:
        cookies = pickle.load(cookiesfile)
        for cookie in cookies:
            driver.add_cookie(cookie)


SelTry = 10


def Creat_Folder(Id):
    try:
        shutil.rmtree(Id)
    except:
        pass
    os.mkdir(Id)


def Click_In(Xpath):
    click_In = WebDriverWait(driver, SelTry).until(
        EC.element_to_be_clickable(
            (By.XPATH, Xpath))
    )
    click_In.click()


def Get_Info():

    sleep(1)
    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div/header/section/div[1]/h2'
    MyData['Id'] = Get_Text(Xpath)

    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div/header/section/ul/li[2]/a/div/span'
    MyData['NoFollowers'] = int(Get_Text(Xpath))

    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div/header/section/ul/li[3]/a/div/span'
    MyData['NoFollowings'] = int(Get_Text(Xpath))

    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div/header/section/div[2]/span'
    MyData['Des_1'] = Get_Text(Xpath)

    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div/header/section/div[2]/div'
    MyData['Des_2'] = Get_Text(Xpath)

    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div/header/section/div[2]/a/div'
    MyData['Des_3'] = Get_Text(Xpath)


def Get_Text(Xpath):
    Text = WebDriverWait(driver, SelTry).until(
        EC.visibility_of_element_located(
            (By.XPATH, Xpath))
    )
    return Text.text


def Get_Posts():
    PostData = []
    ListOfPostUrl = []
    Creat_Folder(f"{MyData['Id']}/Posts")
    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div/div[3]/article/div/div/div'
    PostList = driver.find_elements(by=By.XPATH, value=Xpath)
    for List in PostList:
        Posts = List.find_elements(by=By.TAG_NAME, value='a')
        for Post in Posts:
            PostUrl = Post.get_attribute('href')
            ListOfPostUrl.append(PostUrl)

    for PostCount, PostUrl in enumerate(ListOfPostUrl):

        driver.get(PostUrl)

        try:
            Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div[1]/div[1]/article/div/div[2]/div/div[1]/div/header/div[2]/div[2]/div/div[2]/div/a'
            PostLoc = Get_Text(Xpath)
        except:
            PostLoc = ''

        try:
            Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div[1]/div[1]/article/div/div[2]/div/div[2]/div[1]/ul/div/li/div/div/div[2]/div[1]/span'
            PostDec = Get_Text(Xpath)
        except:
            PostDec = ''

        Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div[1]/div[1]/article/div/div[2]/div/div[2]/div[1]/ul/div/li/div/div/div[2]/div[2]/div/time'
        PostTime = Get_Text(Xpath)

        Loop = True
        i = 0
        while Loop:
            try:
                Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div[1]/div[1]/article/div/div[1]/div/div[1]/div[2]/div/div/div/ul/li[2]/div/div/div/div/div[1]/img'
                Get_Images(Xpath, f'Posts/{str(PostCount)}-{i}')
            except:
                Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div[1]/div[1]/article/div/div[1]/div/div/div/div[1]/img'
                Get_Images(Xpath, f'Posts/{str(PostCount)}-{i}')
            sleep(1)
            try:
                if i == 0:
                    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div[1]/div[1]/article/div/div[1]/div/div[1]/div[2]/div/button'
                else:
                    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div[1]/div[1]/article/div/div[1]/div/div[1]/div[2]/div/button[2]'
                Click_In(Xpath)
                i += 1
            except:
                Loop = False

        PostData.append({
            'PostLoc': PostLoc,
            'PostDec': PostDec,
            'PostTime': PostTime,
            'NumberPost': i + 1
        })

        sleep(5)


def Get_Images(Xpath, Name):
    img = driver.find_element(by=By.XPATH, value=Xpath)
    src = img.get_attribute('src')
    urllib.urlretrieve(src, f"{MyData['Id']}/{Name}.png")


def Get_Followers(url, Original):
    url = url + 'followers/'
    driver.get(url)
    sleep(1)
    OldLength = 0
    NewLength = 1
    while OldLength != NewLength:
        sleep(5)
        recentList = driver.find_elements(
            by=By.XPATH, value="/html/body/div[1]/div/div[1]/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div/div[2]/ul/div/li")
        OldLength = NewLength
        NewLength = len(recentList)
        for list in recentList:
            driver.execute_script("arguments[0].scrollIntoView();", list)

    recentList = driver.find_elements(
        by=By.XPATH, value="/html/body/div[1]/div/div[1]/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div/div[2]/ul/div/li")

    FollowersData = []

    for L, List in enumerate(recentList):

        Id = List.find_element(by=By.TAG_NAME, value='a')
        Id = Id.get_attribute('href')

        FolderName = Id.split('/')[-2]

        Xpath = f'/html/body/div[1]/div/div[1]/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div/div[2]/ul/div/li[{L+1}]/div/div[1]/div[2]/div[2]'
        try:
            Dic = Get_Text(Xpath)
        except:
            Dic = ''

        sleep(1)
        Image = List.find_element(by=By.TAG_NAME, value='img')
        Image = Image.get_attribute('src')

        source = f"{Original}/{FolderName}.png"
        urllib.urlretrieve(Image, source)

        FollowersData.append({'Id': Id,
                              'Dic': Dic,
                              'LiFollowers': [],
                              })

    Creat_Folder(f'{Original}/followers')
    for file_name in glob.iglob(os.path.join(f"{Original}", "*.png")):
        shutil.move(file_name, f'{Original}/followers')

    return FollowersData


def Get_Followings(url, Original):
    url = url + 'following/'
    driver.get(url)
    sleep(1)
    OldLength = 0
    NewLength = 1
    while OldLength != NewLength:
        sleep(5)
        recentList = driver.find_elements(
            by=By.XPATH, value="/html/body/div[1]/div/div[1]/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div/div[3]/ul/div/li")
        OldLength = NewLength
        NewLength = len(recentList)
        for list in recentList:
            driver.execute_script("arguments[0].scrollIntoView();", list)

    recentList = driver.find_elements(
        by=By.XPATH, value="/html/body/div[1]/div/div[1]/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div/div[3]/ul/div/li")

    FollowingsData = []
    for L, List in enumerate(recentList):

        Id = List.find_element(by=By.TAG_NAME, value='a')
        Id = Id.get_attribute('href')

        FolderName = Id.split('/')[-2]

        Xpath = f'/html/body/div[1]/div/div[1]/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div/div[2]/ul/div/li[{L+1}]/div/div[1]/div[2]/div[2]'
        try:
            Dic = Get_Text(Xpath)
        except:
            Dic = ''

        sleep(1)
        Image = List.find_element(by=By.TAG_NAME, value='img')
        Image = Image.get_attribute('src')

        source = f"{Original}/{FolderName}.png"
        urllib.urlretrieve(Image, source)

        FollowingsData.append({'Id': Id,
                              'Dic': Dic,
                               'LiFollowers': [],
                               })

    Creat_Folder(f'{Original}/followings')
    for file_name in glob.iglob(os.path.join(f"{Original}", "*.png")):
        shutil.move(file_name, f'{Original}/followings')

    return FollowingsData


def Get_Stories():

    StoryData = []

    Creat_Folder('Stories')

    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div/div[1]/div/div/div/ul/li[3]/div/div'
    sleep(20)
    Click_In(Xpath)
    sleep(5)
    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/div[1]/div/div[5]/section/div/header/div[2]/div[2]/button[1]'
    Click_In(Xpath)

    StoryTitle_Old = ''
    i = 0
    Loop = True
    while Loop:
        try:
            Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/div[1]/div/div[5]/section/div/header/div[2]/div[1]/div/div/div/div/a'
            StoryTitle = Get_Text(Xpath)

            if StoryTitle_Old == StoryTitle:
                i = i+1
            else:
                i = 0
            if i == 0:
                Creat_Folder(f'Stories/{StoryTitle}')

            Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/div[1]/div/div[5]/section/div/header/div[2]/div[1]/div/div/div/time'
            TimePosted = driver.find_element(by=By.XPATH, value=Xpath).text

            InstaUrl = driver.current_url

            Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/div[1]/div/div[5]/section/div/div[1]/div/div/img'
            img = driver.find_element(by=By.XPATH, value=Xpath)
            img_url = img.get_attribute('src')
            urllib.urlretrieve(
                img_url, f"Stories/{StoryTitle}/{i}.png")

            try:
                Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/div[1]/div/div[5]/section/div/div[1]/div/div/video/source'
                video = driver.find_element(by=By.XPATH, value=Xpath)
                video_url = video.get_property('src')
                urllib.urlretrieve(
                    video_url, f'Stories/{StoryTitle}/{i}.mp4')
            except:
                pass

            Xpath = "/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/div[1]/div/div[5]/section/div/button[@aria-label='Next']"
            Click_In(Xpath)

            StoryData.append({
                'InstaUrl': InstaUrl,
                'Date': TimePosted,
                'StoryTitle': StoryTitle,
                'VideoLocation': f'Stories/{StoryTitle}/{i}.mp4',
                'ImgLocation': f"Stories/{StoryTitle}/{i}.png",
            })

            StoryTitle_Old = StoryTitle
        except:
            Loop = False
    return StoryData

# crawl Data ------------------------------------------------------------------------------------------------


url = 'https://www.instagram.com/saeed_rbh/'
chrome_driver_path = './chromedriver.exe'

option = webdriver.ChromeOptions()
option.add_argument('--headless')

webdriver = webdriver.Chrome(
    executable_path=chrome_driver_path, options=option
)

with webdriver as driver:

    import time
    import datetime
    start = time.time()

    wait = WebDriverWait(driver, SelTry)
    driver.get(url)
    load_cookie(driver)
    driver.get(url)

    MyData = {'Id': [],
              'NoFollowers': [],
              'FollowersData': [],
              'NoFollowings': [],
              'followingsData': [],
              'Des_1': [],
              'Des_2': [],
              'Des_3': [],
              'PostsData': [],
              'StoryData': []
              }

    Get_Info()

    end = time.time()
    print('Info', str(datetime.timedelta(seconds=end - start)))

    Creat_Folder(MyData['Id'])

    Xpath = '/html/body/div[1]/div/div[1]/div/div[1]/div/div/div[1]/div[1]/section/main/div/header/div/div/div/button/img'
    Get_Images(Xpath, 'Id')

    end = time.time()
    print('Image', str(datetime.timedelta(seconds=end - start)))

    followingsData = Get_Followings(url, MyData['Id'])
    MyData['followingsData'] = followingsData

    end = time.time()
    print('followings', str(datetime.timedelta(seconds=end - start)))

    FollowersData = Get_Followers(url, MyData['Id'])
    MyData['FollowersData'] = FollowersData

    end = time.time()
    print('Followers', str(datetime.timedelta(seconds=end - start)))

    PostsData = Get_Posts()
    MyData['PostsData'] = PostsData

    end = time.time()
    print('PostsData', str(datetime.timedelta(seconds=end - start)))

    driver.get(url)

    StoryData = Get_Stories()
    MyData['StoryData'] = StoryData

    end = time.time()
    print('StoryData', str(datetime.timedelta(seconds=end - start)))

    driver.close()
