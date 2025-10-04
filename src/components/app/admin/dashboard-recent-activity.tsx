import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { activities } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminDashboardRecentActivity() {
    return (
        <Card className="col-span-4 lg:col-span-3 glassmorphism">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Updates from your team and jobseekers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={activity.user.avatar} alt="Avatar" data-ai-hint="avatar" />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>
                      {' '}{activity.action}{' '}
                      <span className="font-medium text-primary">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    )
}


export function AdminDashboardRecentActivitySkeleton() {
    return (
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="ml-4 space-y-2">
                           <Skeleton className="h-4 w-64" />
                           <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
