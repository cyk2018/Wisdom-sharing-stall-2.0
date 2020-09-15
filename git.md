

https://www.jianshu.com/p/86549b4674eb

1. 添加远程仓库

```git remote add origin 远程仓库链接```

2. 删除远程仓库

```git remote rm origin 远程仓库链接```

3. 查看当前远程仓库

```git remote -v```

4. 克隆远程库

```git clone 远程仓库链接 本地仓库链接```

5.从远程仓库拉取最新代码

```git pull 远程仓库名 远程分支名:本地分支名```

6.向远程仓库推送最新代码

```git push 远程仓库名 本地分支名:远程分支名```

7.从远程仓库拉取代码时出现
```
 ! [rejected]        master     -> master  (non-fast-forward)
 * [new branch]      master     -> github/master
 ```
``` git pull origin master --allow-unrelated-histories

8. git pull 出现问题时，从控制台进入，查看 git pull 返回的结果， 如果返回结果为 Already up-to-date 则说明拉取成功
